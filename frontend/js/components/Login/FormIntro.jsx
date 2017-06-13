import React from 'react';

const FormError = (props) => {
  if (props.error) {
    return null;
  }

  return (
    <div className="login-form__intro">
      Logg inn for å hente medlemsdetaljene dine.
    </div>
  );
};


export default FormError;