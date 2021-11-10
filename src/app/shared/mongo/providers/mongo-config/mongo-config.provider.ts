import { ConfigService, JOI } from '@grande-armee/pocket-common';
import { Provider } from '@nestjs/common';

import { mongoConfigFactory } from './mongo-config.factory';

export const mongoConfigProvider: Partial<Provider> = {
  useFactory: mongoConfigFactory,
  inject: [ConfigService, JOI],
};
