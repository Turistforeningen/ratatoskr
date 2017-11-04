import React from 'react';
import { localize } from 'react-localize-redux';


const Error = ({ error, translate }) => {
  if (!error) {
    return null;
  }

  let msg = translate('login.sms.verify.general_error');

  if (error === 'invalid') {
    msg = translate('login.sms.verify.invalid_code_error');
  } else if (error === 'network error') {
    msg = translate('login.network_error');
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default localize(Error, 'locale');
