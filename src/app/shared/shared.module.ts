import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { DomainEventsDispatcherModule } from './domain-events-dispatcher/domain-events-dispatcher.module';
import { UnitOfWorkModule } from './unit-of-work/unit-of-work.module';

@Global()
@Module({
  imports: [CommonModule, UnitOfWorkModule, DomainEventsDispatcherModule],
  exports: [CommonModule, UnitOfWorkModule, DomainEventsDispatcherModule],
})
export class SharedModule {}
