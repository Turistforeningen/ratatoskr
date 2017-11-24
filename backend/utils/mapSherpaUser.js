'use strict';

const camelcaseKeys = require('camelcase-keys');
const moment = require('moment');


module.exports = (rawData) => {
  const data = camelcaseKeys(rawData, { deep: true });

  if (!data.medlemskapStatus) {
    data.medlemskapStatus = {};
  }

  return {
    id: data.sherpaId,

    name: `${data.fornavn} ${data.etternavn}`,
    firstName: data.fornavn,
    lastName: data.etternavn,
    email: data.epost,
    mobile: data.mobil,
    birthDate: data.født ? moment(data.født).format('DD.MM.YYYY') : null,

    member: {
      isValid: data.aktivtMedlemskap && data.erMedlem,
      isMember: data.erMedlem,
      memberid: data.medlemsnummer,
      status: {
        currentYear: data.medlemskapStatus.inneværende_år,
        nextYear: data.medlemskapStatus.neste_år,
        isNewMembershipYear: data.medlemskapStatus.nyttMedlemsår,
      },
    },

    household: {
      isFamilyMember: data.erFamiliemedlem,
      isHouseholdMember: data.erHusstandsmedlem,
      mainMemberId: data.tilknyttetHovedmedlem,
      memberIds: data.tilknyttedeHusstandsmedlemmer || [],
    },

    association: !data.forening ? null : {
      name: data.forening.navn,
      ntbId: data.forening.objectId,
      sherpaId: data.forening.sherpaId,
      type: data.forening.type,
    },

    localAssociation: !data.lokalForening ? null : {
      name: data.lokalForening.navn,
      ntbId: data.lokalForening.objectId,
      sherpaId: data.lokalForening.sherpaId,
      type: data.lokalForening.type,
    },
  };
};
