import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Logg inn for å hente medlemsinformasjonen din.
    </div>
  );
};


export default Intro;
