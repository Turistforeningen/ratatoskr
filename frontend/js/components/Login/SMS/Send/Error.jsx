import React from 'react';
import { localize } from 'react-localize-redux';


const Error = ({ toggleDNTUser, error, translate }) => {
  if (!error) {
    return null;
  }

  let msg = (
    <span>
      { translate('login.sms.send.gateway_error_part1') }
      <br />
      <br />
      { translate('login.sms.send.gateway_error_part2') }{' '}
      <a onClick={toggleDNTUser} className="inline">
        { translate('login.sms.send.gateway_error_part3') }
      </a>.
    </span>
  );

  if (error === 'invalid phone number') {
    msg = translate('login.sms.send.invalid_phonenumber_error');
  } else if (error === 'not found') {
    msg = (
      <span>
        { translate('login.sms.send.not_found_error_part1') }{' '}
        <a href="https://www.dnt.no/medlemsservice/" target="_blank" className="inline">
          { translate('login.sms.send.not_found_error_part2') }
        </a>{' '}
        { translate('login.sms.send.not_found_error_part3') }
        <br />
        <br />
        { translate('login.sms.send.not_found_error_part4') }{' '}
        <a onClick={toggleDNTUser} className="inline">
          { translate('login.sms.send.not_found_error_part5') }
        </a>.
      </span>
    );
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
