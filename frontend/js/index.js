import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import bootstrap from './render';

require('../scss/app/index.scss');


OfflinePluginRuntime.install({
  onInstalled: () => {
    console.log('** ON INSTALLED'); // eslint-disable-line
  },

  onUpdating: () => {
    console.log('** ON UPDATING'); // eslint-disable-line
  },

  onUpdateReady: () => {
    console.log('** ON UPDATE READY'); // eslint-disable-line
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    console.log('** ON UPDATED > RELOAD'); // eslint-disable-line
    window.location.reload();
  },
});

bootstrap();
