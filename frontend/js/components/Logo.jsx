import React from 'react';

const logoSVG = require('../../img/logo.svg');


const createMarkup = () => ({__html: logoSVG});


const Logo = () => <span dangerouslySetInnerHTML={createMarkup()} />;


export default Logo;
