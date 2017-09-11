import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      <p>
        Det er flere brukere som har samme kombinasjon av epost og passord.
      </p>
      <p>
        Velg den brukeren du ønsker å logge inn med.
      </p>
    </div>
  );
};


export default Intro;
