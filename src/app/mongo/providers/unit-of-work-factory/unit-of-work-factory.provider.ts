import { Provider } from '@nestjs/common';

import { UnitOfWorkFactory } from './unit-of-work-factory';

export const unitOfWorkFactoryProvider: Provider = {
  provide: UnitOfWorkFactory,
  useClass: UnitOfWorkFactory,
};
