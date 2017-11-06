import React from 'react';
import { localize } from 'react-localize-redux';


const Success = ({ email, error, translate }) => {
  if (error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      { translate('login.reset.success').replace('{email}', email) }
    </div>
  );
};


export default localize(Success, 'locale');
