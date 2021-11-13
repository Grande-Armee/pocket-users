import { Provider } from '@nestjs/common';

import { UnitOfWorkFactory } from './unitOfWorkFactory';

export const unitOfWorkFactoryProvider: Provider = {
  provide: UnitOfWorkFactory,
  useClass: UnitOfWorkFactory,
};
