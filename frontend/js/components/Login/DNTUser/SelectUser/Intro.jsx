import React from 'react';
import { localize } from 'react-localize-redux';


const Intro = ({ error, translate }) => {
  if (error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      <p>
        { translate('login.dnt_user.select_user.ingress_part1') }
      </p>
      <p>
        { translate('login.dnt_user.select_user.ingress_part2') }
      </p>
    </div>
  );
};


export default localize(Intro, 'locale');
