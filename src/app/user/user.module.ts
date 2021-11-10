import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMapper } from './mappers/user/user.mapper';
import { bcryptProvider } from './providers/bcrypt';
import { jwtProvider } from './providers/jwt';
import { UserRepositoryFactory } from './repositories/user/user.repository';
import { UserSchema, USER_MODEL } from './schemas/user.schema';
import { HashService } from './services/hash/hash.service';
import { TokenService } from './services/token/token.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])],
  providers: [UserService, UserRepositoryFactory, UserMapper, jwtProvider, bcryptProvider, HashService, TokenService],
  exports: [UserService],
})
export class UserModule {}
