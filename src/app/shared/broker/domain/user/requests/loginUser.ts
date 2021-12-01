import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginUserPayloadDto {
  @IsString()
  @Expose()
  public readonly email: string;

  @IsString()
  @Expose()
  public readonly password: string;
}

export class LoginUserResponseDto {
  @Expose()
  public readonly token: string;
}
