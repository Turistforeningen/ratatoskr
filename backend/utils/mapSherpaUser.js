'use strict';


module.exports = (data) => ({
  id: data.sherpa_id,

  name: `${data.fornavn} ${data.etternavn}`,
  firstName: data.fornavn,
  lastName: data.etternavn,
  email: data.epost,
  mobile: data.mobil,
  birthDate: data.født,

  member: {
    isValid: data.aktivt_medlemskap && data.er_medlem,
    isMember: data.er_medlem,
    memberid: data.medlemsnummer,
    status: {
      currentYear: data.medlemskap_status.inneværende_år,
      nextYear: data.medlemskap_status.neste_år,
      isNewMembershipYear: data.medlemskap_status.nytt_medlemsår,
    },
  },

  household: {
    isFamilyMember: data.er_familiemedlem,
    isHouseholdMember: data.er_husstandsmedlem,
    mainMemberId: data.tilknyttet_hovedmedlem,
    memberIds: data.tilknyttede_husstandsmedlemmer || [],
  },

  association: {
    name: data.forening.navn,
    ntbId: data.forening.object_id,
    sherpaId: data.forening.sherpa_id,
    type: data.forening.type,
  },

});
