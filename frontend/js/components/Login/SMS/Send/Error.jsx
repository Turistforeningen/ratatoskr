import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under innlogging. Vennligst prøv igjen.';

  if (props.error === 'invalid phone number') {
    msg = 'Du har skrevet inn et ugyldig mobilnummer. Vennligst prøv igjen.';
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


export default Error;
