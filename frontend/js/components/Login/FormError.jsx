import React from 'react';

const FormError = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under innlogging. Vennligst prøv igjen.';

  if (props.error === 'invalid credentials') {
    msg = 'Du har oppgitt feil brukernavn og/eller passord. ' +
          'Vennligst prøv igjen.';
  } else if (props.error === 'network error') {
    msg = 'Vi klarte ikke få kontakt med tjenesten. ' +
          'Pass på at du er tilkoblet internett og prøv igjen.';
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default FormError;
