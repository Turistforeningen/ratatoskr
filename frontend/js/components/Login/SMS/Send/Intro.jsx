import React from 'react';


const Intro = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Vi sender deg en innloggingskode på SMS som du bruker til å verifisere
      {' '}
      hvem du er.
    </div>
  );
};


export default Intro;
