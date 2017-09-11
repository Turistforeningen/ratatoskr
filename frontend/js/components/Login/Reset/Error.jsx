import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under gjennoppretting av passordet. Vennligst prøv igjen.';

  if (props.error === 'network error') {
    msg = 'Vi klarte ikke få kontakt med tjenesten. ' +
          'Pass på at du er tilkoblet internett og prøv igjen.';
  } else if (props.error === 'unregistered_email') {
    msg = (
      <span>
        Du har ikke opprettet brukerkonto ennå. Du kan
        {' '}
        <a href="https://www.dnt.no/minside/logg-inn/#registrering">
          opprette din bruker her
        </a> — det er kjapt, enkelt og gratis!
      </span>
    );
  } else if (props.error === 'unknown_email') {
    msg = 'Denne e-postadressen er ikke registrert på noen av våre brukere. ' +
          'Kontrollér at du har skrevet adressen riktig.';
  } else if (props.error === 'empty email') {
    msg = 'Du må skrive inn e-postadressen din.';
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default Error;
