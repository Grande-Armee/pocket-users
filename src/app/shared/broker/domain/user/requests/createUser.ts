import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserPayloadDto {
  @IsString()
  @Expose()
  public readonly email: string;

  @IsString()
  @Expose()
  public readonly password: string;
}

export class CreateUserResponseDto {
  @Expose()
  public readonly user: any;
}
