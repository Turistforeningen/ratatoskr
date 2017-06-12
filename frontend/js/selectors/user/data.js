import { getIsPending as getIsFetchPending } from './fetch';
import { getIsPending as getIsUpdatePending } from './update';


// export const getUser = (state) => state.persisted.user.data;
export const getUser = (state) => ({
  ...state.persisted.user.data,
  ...{
    member: {
      isMember: false,
      isValid: false,
      memberid: null,
      status: {
        currentYear: false,
        isNewMembershipYear: true,
        nextYear: false,
      },
    },
    birthDate: null,
    association: {},
    household: {},
  },
});


export const getIsUpdating = (state) =>
  getIsFetchPending(state) && getIsUpdatePending(state);
