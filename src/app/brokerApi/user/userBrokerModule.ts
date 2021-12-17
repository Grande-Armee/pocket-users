import { ClsModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { UserModule } from '@domain/user/userModule';
import { BrokerModule } from '@shared/broker/brokerModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserBrokerController } from './controllers/user/userController';

@Module({
  imports: [BrokerModule, UnitOfWorkModule, ClsModule, UserModule],
  providers: [UserBrokerController],
})
export class UserBrokerModule {}
