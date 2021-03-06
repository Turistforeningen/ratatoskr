import React from 'react';
import { localize } from 'react-localize-redux';


const Intro = ({ error, translate }) => {
  if (error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      { translate('login.sms.select_user.ingress') }
    </div>
  );
};


export default localize(Intro, 'locale');
