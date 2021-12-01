import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { UserLanguage } from '@domain/user/entities/types/userLanguage';

import { UserDto } from './userDto';

export class CreateUserPayloadDto {
  @IsString()
  @Expose()
  public readonly email: string;

  @IsString()
  @Expose()
  public readonly password: string;

  @Expose()
  public readonly language: UserLanguage;
}

export class CreateUserResponseDto {
  @Expose()
  public readonly user: UserDto;
}
