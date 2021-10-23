import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';

import { MongoModule } from './mongo/mongo';
import { UserModule } from './user/user';

@Module({
  imports: [UserModule, CommonModule, MongoModule.forRoot()],
})
export class AppModule {}
