import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { MongoModule } from './mongo/mongo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, CommonModule, MongoModule],
})
export class AppModule {}
