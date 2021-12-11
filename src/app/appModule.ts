import { Module } from '@nestjs/common';

import { BrokerApiModule } from './brokerApi/brokerApiModule';
import { DomainModule } from './domain/domainModule';
import { LoggerModule } from './shared/logger/loggerModule';
import { MongoModule } from './shared/mongo/mongoModule';
import { UnitOfWorkModule } from './shared/unitOfWork/unitOfWorkModule';

@Module({
  imports: [LoggerModule, MongoModule, UnitOfWorkModule, DomainModule, BrokerApiModule],
})
export class AppModule {}
