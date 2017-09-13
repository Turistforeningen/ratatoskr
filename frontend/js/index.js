import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import Modernizr from './lib/modernizr';
import raven from './lib/raven';
import './lib/ios-orientationchange-fix';

import bootstrap from './render';

require('../scss/app/index.scss');


// Initialize raven
raven();

// If running standalone on iOS
if (window && window.navigator && window.navigator.standalone) {
  document.body.className += ' mobile-standalone';
}


OfflinePluginRuntime.install({
  onInstalled: () => {},

  onUpdating: () => {},

  onUpdateReady: () => {
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    window.location.reload();
  },
});

bootstrap();
