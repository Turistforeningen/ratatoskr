'use strict';

const redis = require('../lib/redis');
const settings = require('../lib/settings');
const sherpa = require('../lib/sherpa');
const mapSherpaUser = require('../utils/mapSherpaUser');
const removeObjectKeys = require('../utils/removeObjectKeys');


const SHERPA_URLS = {
  membership: `${settings.OAUTH_DOMAIN}/api/oauth/medlemsdata/`,
  household: `${settings.OAUTH_DOMAIN}/api/oauth/medlemsdata/husstanden/`,
};


const API_HIDDEN_FIELDS = [
  ['household', 'mainMemberId'],
  ['household', 'memberIds'],
  ['ratatoskrCode'],
  ['OAuthTokens'],
  ['association', 'ntbId'],
  ['association', 'sherpaId'],
];


const User = () => {
  const self = Object.assign({}, {
    id: null,

    name: null,
    firstName: null,
    lastName: null,
    email: null,
    mobile: null,
    birthDate: null,

    member: {
      isValid: null,
      isMember: null,
      memberid: null,
      status: {
        currentYear: null,
        nextYear: null,
        isNewMembershipYear: null,
      },
    },

    household: {
      isMember: null,
      mainMemberId: null,
      memberIds: [],
      members: null,
      mainMember: null,
    },

    association: {
      name: null,
      ntbId: null,
      sherpaId: null,
      type: null,
    },

    adminToken: null,
    OAuthTokens: null,

    isMainHouseholdMember() {
      const { household } = self;
      return household.mainMember && household.mainMember.id === self.id;
    },

    haveFamilyMembers() {
      return (
        !!self.household.memberIds.length &&
        self.getFamilyMembers().length
      );
    },

    getFamilyMembers() {
      const { household } = self;
      return household.members ?
        household.members.filter((m) => m.id !== self.id) :
        [];
    },

    getCurrentYear() {
      const cur = new Date();
      return cur.getFullYear();
    },

    getNextYear() {
      const cur = new Date();
      const next = new Date(+cur.getFullYear() + 1, 1, 1);
      return next.getFullYear();
    },

    getAPIRepresentation() {
      // Remove hidden fields from user
      const res = removeObjectKeys(self, API_HIDDEN_FIELDS);

      // Remove hidden fields from main member
      if (res.household.mainMember) {
        res.household.mainMember =
          removeObjectKeys(res.household.mainMember, API_HIDDEN_FIELDS);
      }

      // Remove hidden fields from family members
      if (res.household.members && res.household.members.length) {
        res.household.members = res.household.members
          .map((m) => removeObjectKeys(m, API_HIDDEN_FIELDS));
      }

      return res;
    },

    /**
     ** Communication with Sherpa
     ** */

    setTokens(tokens) {
      self.OAuthTokens = Object.assign({}, tokens);
      return self;
    },

    setRatatoskrCode(code) {
      self.ratatoskrCode = code;
      self.OAuthTokens = null;
      return self;
    },

    sherpaRequest(path, method = 'GET', body = null, retrying = false) {
      const promise = new Promise((resolve, reject) => {
        const req = method === 'GET'
          ? sherpa.user.get(self.OAuthTokens, path)
          : sherpa.user.post(self.OAuthTokens, path, body);

        req
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            // Access token may be expired, try to refresh it
            if (err === 403 && !retrying) {
              sherpa.user.refreshToken(self.OAuthTokens)
                .then((tokens) => {
                  if (tokens) {
                    self.setTokens(tokens);
                    self.sherpaRequest(path, method, body, true)
                      .then((res) => {
                        resolve(res);
                      })
                      .catch((e) => reject(e));
                  } else {
                    resolve();
                  }
                })
                .catch((e) => reject(e));
            } else {
              reject(err);
            }
          });
      });

      return promise;
    },

    loadSherpaData() {
      if (self.OAuthTokens && self.OAuthTokens.access_token) {
        return self.loadSherpaDataUsingOAuthToken();
      } else if (self.adminToken) {
        return self.loadSherpaDataUsingAdminToken();
      }

      throw new Error(
        'Unable to load Sherpa data because credentials are not set'
      );
    },

    loadSherpaDataUsingOAuthToken() {
      if (!self.OAuthTokens || !self.OAuthTokens.access_token) {
        throw new Error(
          'Unable to load Sherpa data because OAuth token is not set'
        );
      }

      const promise = new Promise((resolve, reject) => {
        self.sherpaRequest(SHERPA_URLS.membership)
          .then((data) => {
            if (!data) {
              self.destroy();
              resolve(self);
            }
            if (self.id && data.sherpa_id !== self.id) {
              throw new Error(
                'The resulting user from Sherpa has a different ID than ' +
                'the requesting user'
              );
            }
            Object.assign(self, mapSherpaUser(data));

            if (!self.household.memberIds.length) {
              resolve(self);
            } else {
              sherpa.user.get(self.OAuthTokens, SHERPA_URLS.household)
                .then((householdData) => {
                  if (householdData.husstandsmedlemmer) {
                    self.household.members = householdData.husstandsmedlemmer
                      .filter((member) => member.sherpa_id !== self.id)
                      .map((member) => User().update(mapSherpaUser(member)));
                  }

                  if (householdData.hovedmedlem
                      && householdData.hovedmedlem.sherpa_id !== self.id) {
                    self.household.mainMember =
                      User().update(mapSherpaUser(householdData.hovedmedlem));
                  }

                  resolve(self);
                })
                .catch((err) => {
                  throw new Error(err);
                });
            }
          })
          .catch((err) => {
            if (err === 401) {
              self.destroy();
              resolve(self);
            } else {
              throw new Error(err);
            }
          });
      });

      return promise;
    },

    loadSherpaDataUsingAdminToken() {
      if (!self.adminToken) {
        throw new Error(
          'Unable to load Sherpa data because adminToken is not set'
        );
      }

      return sherpa.user.authenticateByAdminToken(self.id, self.adminToken)
        .then((data) => {
          if (data.user && data.user.sherpaId) {
            Object.assign(self, mapSherpaUser(data.user));

            if (data.mainMember && data.mainMember.sherpaId !== self.id) {
              self.household.mainMember =
                User().update(mapSherpaUser(data.mainMember));
            }

            if (data.householdMembers && data.householdMembers.length) {
              self.household.members = data.householdMembers
                .filter((member) => member.sherpaId !== self.id)
                .map((member) => User().update(mapSherpaUser(member)));
            }
          } else {
            // Invalid code
            self.destroy();
          }

          return self;
        });
    },

    update(data) {
      Object.assign(self, data);
      return self;
    },

    destroy() {
      Object.keys(self).forEach((key) => {
        if (typeof self[key] !== 'function') {
          self[key] = null;
        }
      });
      return self;
    },
  });

  return self;
};


module.exports = User;
