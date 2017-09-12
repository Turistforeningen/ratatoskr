import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under innlogging. Vennligst prøv igjen.';

  if (props.error === 'invalid credentials') {
    msg = 'Du har oppgitt feil brukernavn og/eller passord. ' +
          'Vennligst prøv igjen.';
  } else if (props.error === 'network error') {
    msg = 'Vi klarte ikke å få kontakt med tjenesten. ' +
          'Pass på at du er tilkoblet internett og prøv igjen.';
  } else if (props.error === 'sherpa error') {
    msg = 'Vi klarte ikke å få kontakt med tjenesten. ' +
          'Prøv igjen eller kom tilbake senere.';
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default Error;
