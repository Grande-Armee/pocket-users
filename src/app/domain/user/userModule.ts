import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, USER_MODEL } from './entities/user';
import { UserMapper } from './mappers/user/userMapper';
import { bcryptProvider } from './providers/bcrypt';
import { jwtProvider } from './providers/jwt';
import { UserRepositoryFactory } from './repositories/user/userRepository';
import { HashService } from './services/hash/hashService';
import { TokenService } from './services/token/tokenService';
import { UserService } from './services/user/userService';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])],
  providers: [UserService, UserRepositoryFactory, UserMapper, jwtProvider, bcryptProvider, HashService, TokenService],
  exports: [UserService],
})
export class UserModule {}
