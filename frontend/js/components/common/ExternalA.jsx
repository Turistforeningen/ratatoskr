import React from 'react';


const ExternalA = (props) => (
  <a
    onClick={(e) => {
      window.open(props.href);
      e.preventDefault();
      return false;
    }}
    {...props}>
    {props.children}
  </a>
);


export default ExternalA;
