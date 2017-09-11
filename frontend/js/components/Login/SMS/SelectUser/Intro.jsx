import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Vi fant flere brukere som er tilknyttet samme mobilnummer. Velg hvem av
      {' '}dem du vil bruke.
    </div>
  );
};


export default Intro;
