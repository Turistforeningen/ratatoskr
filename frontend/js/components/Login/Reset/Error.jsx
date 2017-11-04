import React from 'react';
import { localize } from 'react-localize-redux';


const Error = ({ error, translate }) => {
  if (!error) {
    return null;
  }

  let msg = translate('login.reset.general_error');

  if (error === 'network error') {
    msg = translate('login.network_error');
  } else if (error === 'unregistered_email') {
    msg = (
      <span>
        { translate('login.reset.unregistered_email_error_part1') }
        {' '}
        <a href="https://www.dnt.no/minside/logg-inn/#registrering">
        { translate('login.reset.unregistered_email_error_part2') }
        </a>{' '}
        { translate('login.reset.unregistered_email_error_part3') }
      </span>
    );
  } else if (error === 'unknown_email') {
    msg = translate('login.reset.unknown_email');
  } else if (error === 'empty email') {
    msg = translate('login.reset.empty_email');
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default localize(Error, 'locale');
