import { Provider } from '@nestjs/common';

import { DomainEventsDispatcherFactory } from './domain-events-dispatcher-factory';

export const domainEventsDispatcherFactoryProvider: Provider = {
  provide: DomainEventsDispatcherFactory,
  useClass: DomainEventsDispatcherFactory,
};
