import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = (
    <span>
      Vi har problemer med utsending av SMS.{' '}
      Prøv igjen, eller kom tilbake senere.
      <br />
      <br />
      Du kan også logge inn med{' '}
      <a onClick={props.toggleDNTUser} className="inline">
      brukernavn og passord</a>.
    </span>
  );

  if (props.error === 'invalid phone number') {
    msg = 'Du har skrevet inn et ugyldig mobilnummer.';
  } else if (props.error === 'not found') {
    msg = (
      <span>
        Vi fant ingen bruker registrert med dette mobilnummeret. Sjekk at
        {' '}du har skrevet riktig, eller kontakt{' '}
        <a href="https://www.dnt.no/medlemsservice/" target="_blank" className="inline">
        medlemsservice</a>{' '}
        for å legge det til i medlemsinformasjonen din.
        <br />
        <br />
        Du kan også logge inn med{' '}
        <a onClick={props.toggleDNTUser} className="inline">
        brukernavn og passord</a>.
      </span>
    );
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
