import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { BrokerModule } from './broker/brokerModule';
import { MongoModule } from './mongo/mongoModule';
import { UnitOfWorkModule } from './unitOfWork/unitOfWorkModule';

@Global()
@Module({
  imports: [CommonModule, MongoModule, UnitOfWorkModule, BrokerModule],
  exports: [CommonModule, MongoModule, UnitOfWorkModule, BrokerModule],
})
export class SharedModule {}
