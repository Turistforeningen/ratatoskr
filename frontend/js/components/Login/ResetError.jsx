import React from 'react';

const FormError = (props) => {
  if (!props.error) {
    return null;
  }

  let msg = 'Det oppstod et problem under gjennoppretting av passordet. Vennligst prøv igjen.';

  if (props.error === 'network error') {
    msg = 'Vi klarte ikke få kontakt med tjenesten. ' +
          'Pass på at du er tilkoblet internett og prøv igjen.';
  } else if (props.error === 'sherpa error') {
    msg = 'Det oppstod et problem med tjenesten. ' +
          'Vi jobber med å rette feilen, og må be om at du forsøker ' +
          'igjen senere.';
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
          'Er det denne adressen du er registrert med? Sjekk også at du har ' +
          'skrevet adressen riktig.';
  }

  return (
    <div className="login-form__error">
      {msg}
    </div>
  );
};


export default FormError;
