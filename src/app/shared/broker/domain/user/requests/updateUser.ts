import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { UserLanguage } from '@domain/user/entities/types/userLanguage';

import { UserDto } from './userDto';

export class UpdateUserPayloadDto {
  @IsUUID('4')
  @Expose()
  public readonly userId: string;

  @Expose()
  public readonly language: UserLanguage;
}

export class UpdateUserResponseDto {
  @Expose()
  public readonly user: UserDto;
}
