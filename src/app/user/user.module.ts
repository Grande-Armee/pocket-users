import { CommonModule } from '@grande-armee/pocket-common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMapper } from './mappers/user/user.mapper';
import { bcryptProvider } from './providers/bcrypt';
import { jwtProvider } from './providers/jwt';
import { UserRepository } from './repositories/user/user.repository';
import { UserSchema, USER_MODEL } from './schemas/user.schema';
import { HashService } from './services/hash/hash.service';
import { TokenService } from './services/token/token.service';
import { UserService } from './services/user/user.service';
import { userConfigProvider } from './user-config/user-config.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]), CommonModule],
  providers: [
    UserService,
    UserRepository,
    UserMapper,
    jwtProvider,
    bcryptProvider,
    HashService,
    TokenService,
    userConfigProvider,
  ],
})
export class UserModule {}
