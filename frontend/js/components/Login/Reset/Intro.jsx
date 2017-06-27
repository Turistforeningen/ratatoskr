import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Skriv inn epostadressen din for å få tilsendt videre instruksjoner.
    </div>
  );
};


export default Intro;
