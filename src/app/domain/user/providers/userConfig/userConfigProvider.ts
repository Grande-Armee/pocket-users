import { ConfigService, JOI } from '@grande-armee/pocket-common';
import { Provider } from '@nestjs/common';

import { userConfigFactory } from './userConfigFactory';

export const USER_CONFIG = Symbol('USER_CONFIG');

export const userConfigProvider: Provider = {
  useFactory: userConfigFactory,
  inject: [ConfigService, JOI],
  provide: USER_CONFIG,
};
