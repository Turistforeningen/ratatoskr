import { getIsPending as getIsFetchPending } from './fetch';
import { getIsPending as getIsUpdatePending } from './update';


export const getUser = (state) => state.persisted.user.data;


export const getIsUpdating = (state) =>
  getIsFetchPending(state) && getIsUpdatePending(state);
