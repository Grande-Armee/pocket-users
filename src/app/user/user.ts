import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, USER_MODEL_TOKEN } from './models/user';
import { UserService } from './services/user';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
