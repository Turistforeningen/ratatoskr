import React from 'react';

const FormError = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      En epost er nå sendt til {props.email}.
    </div>
  );
};


export default FormError;
