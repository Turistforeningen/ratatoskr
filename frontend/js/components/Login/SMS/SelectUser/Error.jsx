import React from 'react';
import { localize } from 'react-localize-redux';


const Error = ({ error, translate }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="login-form__error">
      { translate('login.sms.select_user.general_error') }
    </div>
  );
};


export default localize(Error, 'locale');
