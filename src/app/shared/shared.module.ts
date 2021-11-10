import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { DomainEventsDispatcherModule } from './domain-events-dispatcher/domain-events-dispatcher.module';
import { MongoModule } from './mongo/mongo.module';
import { UnitOfWorkModule } from './unit-of-work/unit-of-work.module';

@Global()
@Module({
  imports: [CommonModule, MongoModule, UnitOfWorkModule, DomainEventsDispatcherModule],
  exports: [CommonModule, MongoModule, UnitOfWorkModule, DomainEventsDispatcherModule],
})
export class SharedModule {}
