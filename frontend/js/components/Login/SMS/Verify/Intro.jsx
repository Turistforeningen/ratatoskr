import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Du vil straks motta en innlogginskode på SMS. Skriv den inn i feltet
      {' '}
      under for å hente frem medlemsinformasjonen din.
    </div>
  );
};


export default Intro;
