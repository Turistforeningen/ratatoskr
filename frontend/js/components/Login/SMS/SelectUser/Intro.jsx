import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Vi fant flere brukere som er tilknyttet samme mobilnummer.{' '}
      Velg den brukeren du ønsker å logge inn med.
    </div>
  );
};


export default Intro;
