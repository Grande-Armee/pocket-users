import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { DomainEventsDispatcherModule } from './domainEventsDispatcher/domainEventsDispatcherModule';
import { MongoModule } from './mongo/mongoModule';
import { UnitOfWorkModule } from './unitOfWork/unitOfWorkModule';

@Global()
@Module({
  imports: [CommonModule, MongoModule, UnitOfWorkModule, DomainEventsDispatcherModule],
  exports: [CommonModule, MongoModule, UnitOfWorkModule, DomainEventsDispatcherModule],
})
export class SharedModule {}
