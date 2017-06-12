import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import bootstrap from './render';

require('../scss/app/index.scss');


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
