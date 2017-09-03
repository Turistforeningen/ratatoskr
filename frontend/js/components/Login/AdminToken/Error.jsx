import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  return (
    <div className="login-form__error">
      Klarte ikke logge inn ved hjelp av engangslenken.
      <br />
      Prøv på ny via Sherpa.
    </div>
  );
};


export default Error;
