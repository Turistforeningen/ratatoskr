import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import bootstrap from './render';

require('../scss/app/index.scss');


OfflinePluginRuntime.install();

bootstrap();
