import { Module } from '@nestjs/common';

import { domainEventsDispatcherFactoryProvider } from './providers/domain-events-dispatcher-factory';

@Module({
  providers: [domainEventsDispatcherFactoryProvider],
  exports: [domainEventsDispatcherFactoryProvider],
})
export class DomainEventsDispatcherModule {}
