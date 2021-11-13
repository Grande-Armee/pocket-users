import { Module } from '@nestjs/common';

import { domainEventsDispatcherFactoryProvider } from './providers/domainEventsDispatcherFactory';

@Module({
  providers: [domainEventsDispatcherFactoryProvider],
  exports: [domainEventsDispatcherFactoryProvider],
})
export class DomainEventsDispatcherModule {}
