import React from 'react';
import { localize } from 'react-localize-redux';


const StoreIcons = ({translate, currentLanguage, small}) => {
  if (window.ratatoskr.isNative) {
    return null;
  }

  let className = 'appstore-icon-container';
  if (small) {
    className += ' small';
  }

  return (
    <div className={className}>
      <a
        href={
          'https://itunes.apple.com/no/app/dnt-medlem/id1290066714?l=' +
          `${currentLanguage}&mt=8`
        }
        target="_blank">
        <img
          src={
            'https://s3-eu-west-1.amazonaws.com/turistforeningen/appstore_' +
            `${currentLanguage}.png`
          }
          alt="Last ned i AppStore" />
      </a>

      <a
        href="https://play.google.com/store/apps/details?id=no.dnt.medlem"
        target="_blank">
        <img
          src={
            'https://s3-eu-west-1.amazonaws.com/turistforeningen/googleplay_' +
            `${currentLanguage}.png`
          }
          alt="Last ned i Google Play" />
      </a>
    </div>
  );
};


export default localize(StoreIcons, 'locale');
