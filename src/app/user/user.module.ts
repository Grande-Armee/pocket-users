import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserRepository } from './repositories/user.repository';
import { UserSchema, USER_MODEL_TOKEN } from './schemas/user.schema';
import { UserEntitySerializer } from './serializers/user-entity.serializer';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL_TOKEN, schema: UserSchema }])],
  providers: [UserService, UserRepository, UserEntitySerializer, AuthService],
  exports: [UserService],
})
export class UserModule {}
