import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

import { UserDto } from './userDto';

export class FindUserPayloadDto {
  @IsUUID('4')
  @Expose()
  public readonly userId: string;
}

export class FindUserResponseDto {
  @Expose()
  public readonly user: UserDto;
}
