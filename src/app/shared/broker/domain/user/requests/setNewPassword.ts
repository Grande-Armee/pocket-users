import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

import { UserDto } from './userDto';

export class SetNewPasswordPayloadDto {
  @IsUUID('4')
  @Expose()
  public readonly userId: string;

  @IsString()
  @Expose()
  public readonly newPassword: string;
}

export class SetNewPasswordResponseDto {
  @Expose()
  public readonly user: UserDto;
}
