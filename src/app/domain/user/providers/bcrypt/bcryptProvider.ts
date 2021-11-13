import { Provider } from '@nestjs/common';

import { bcryptFactory } from './bcryptFactory';

export const BCRYPT = Symbol('BCRYPT');

export const bcryptProvider: Provider = {
  provide: BCRYPT,
  useFactory: bcryptFactory,
};
