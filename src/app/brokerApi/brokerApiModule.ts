import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { DomainModule } from '@domain/domainModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserBrokerModule } from './user/userBrokerModule';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, DomainModule, ClsModule, UserBrokerModule],
})
export class BrokerApiModule {}
