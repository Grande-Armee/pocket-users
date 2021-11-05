import { ConfigService, JOI_TOKEN } from '@grande-armee/pocket-common';
import { Provider } from '@nestjs/common';

import { userConfigFactory } from './user-config.factory';

export const USER_CONFIG = Symbol('USER_CONFIG');

export const mongoConfigProvider: Partial<Provider> = {
  useFactory: userConfigFactory,
  inject: [ConfigService, JOI_TOKEN],
  provide: USER_CONFIG,
};
