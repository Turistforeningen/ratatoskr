import React from 'react';
import { localize } from 'react-localize-redux';


const Error = ({ error, translate }) => {
  if (!error) {
    return null;
  }

  let msg = translate('login.general_error');

  if (error === 'invalid credentials') {
    msg = translate('login.dnt_user.credentials_error');
  } else if (error === 'network error') {
    msg = translate('login.network_error');
  } else if (error === 'sherpa error') {
    msg = translate('login.sherpa_error');
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default localize(Error, 'locale');
