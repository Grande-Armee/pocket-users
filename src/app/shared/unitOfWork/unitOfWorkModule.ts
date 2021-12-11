import { IntegrationEventsStoreModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { LoggerModule } from '@shared/logger/loggerModule';
import { MongoModule } from '@shared/mongo/mongoModule';

import { UnitOfWorkFactory } from './providers/unitOfWorkFactory';

@Module({
  imports: [LoggerModule, MongoModule, IntegrationEventsStoreModule],
  providers: [UnitOfWorkFactory],
  exports: [UnitOfWorkFactory],
})
export class UnitOfWorkModule {}
