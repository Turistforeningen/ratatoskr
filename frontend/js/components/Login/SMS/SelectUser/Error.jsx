import React from 'react';


const Error = (props) => {
  if (!props.error) {
    return null;
  }

  return (
    <div className="login-form__error">
      Det oppstod et problem når vi forsøkte å hente medlemsinformasjonen.
      {' '}Venligst prøv igjen.
    </div>
  );
};


export default Error;
