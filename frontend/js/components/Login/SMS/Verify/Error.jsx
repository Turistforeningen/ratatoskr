import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under verifiseringen av koden. ' +
            'Vennligst prøv igjen.';

  if (props.error === 'invalid') {
    msg = 'Koden du skrev inn er ikke riktig.';
  } else if (props.error === 'network error') {
    msg = 'Vi klarte ikke å få kontakt med tjenesten. ' +
          'Pass på at du er tilkoblet internett og prøv igjen.';
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default Error;
