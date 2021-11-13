import { Provider } from '@nestjs/common';

import { DomainEventsDispatcherFactory } from './domainEventsDispatcherFactory';

export const domainEventsDispatcherFactoryProvider: Provider = {
  provide: DomainEventsDispatcherFactory,
  useClass: DomainEventsDispatcherFactory,
};
