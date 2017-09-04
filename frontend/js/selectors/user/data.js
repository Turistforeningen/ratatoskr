import { getIsPending as getIsFetchPending } from './fetch';
import { getIsPending as getIsUpdatePending } from './update';


export const getUser = (state) => state.persisted.user.data;


export const getLastUpdated = (state) => (
  state.persisted.user.lastUpdated
    ? new Date(state.persisted.user.lastUpdated)
    : null
);


export const getIsUpdating = (state) =>
  getIsFetchPending(state) || getIsUpdatePending(state);
