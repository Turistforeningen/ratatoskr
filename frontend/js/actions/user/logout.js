import Cookies from 'js-cookie';

import { getIsPending } from '../../selectors/user/login';
import { logout as APIlogout } from '../../api/user';


const deleteSessionCookie = () => {
  Cookies.remove('sessionid');
};


// eslint-disable-next-line
export const logout = () => (dispatch, getState) => {
  dispatch({
    type: 'USER_LOGOUT',
  });

  APIlogout()
    .then(() => { deleteSessionCookie(); })
    .catch(() => { deleteSessionCookie(); });

  deleteSessionCookie();
};
