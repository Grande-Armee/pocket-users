import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMapper } from './mappers/user/userMapper';
import { bcryptProvider } from './providers/bcrypt';
import { jwtProvider } from './providers/jwt';
import { userConfigProvider } from './providers/userConfig/userConfigProvider';
import { UserRepositoryFactory } from './repositories/user/userRepository';
import { UserSchema, USER_MODEL } from './schemas/user';
import { HashService } from './services/hash/hashService';
import { TokenService } from './services/token/tokenService';
import { UserService } from './services/user/userService';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])],
  providers: [
    UserService,
    UserRepositoryFactory,
    UserMapper,
    jwtProvider,
    bcryptProvider,
    HashService,
    TokenService,
    userConfigProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
