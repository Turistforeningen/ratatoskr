import React from 'react';

const iconSVG = require('../../img/external-link-icon.svg');


const createMarkup = () => ({__html: iconSVG});


const ExternalA = (props) => (
  <a {...props}>
    {props.children}
    <i dangerouslySetInnerHTML={createMarkup()} />
  </a>
);


export default ExternalA;
