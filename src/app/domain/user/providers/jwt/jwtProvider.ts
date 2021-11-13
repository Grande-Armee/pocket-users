import { Provider } from '@nestjs/common';

import { jwtFactory } from './jwtFactory';

export const JWT = Symbol('JWT');

export const jwtProvider: Provider = {
  provide: JWT,
  useFactory: jwtFactory,
};
