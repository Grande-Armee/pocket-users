import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMapper } from './mappers/userMapper/userMapper';
import { bcryptProvider } from './providers/bcrypt';
import { jwtProvider } from './providers/jwt';
import { userConfigProvider } from './providers/userConfig/userConfigProvider';
import { UserRepositoryFactory } from './repositories/userRepository/userRepository';
import { UserSchema, USER_MODEL } from './schemas/userSchema';
import { HashService } from './services/hashService/hashService';
import { TokenService } from './services/tokenService/tokenService';
import { UserService } from './services/userService/userService';

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
