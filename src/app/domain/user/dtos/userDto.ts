import { Transformer, UserLanguage, UserRole } from '@grande-armee/pocket-common';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  @IsEnum(UserRole)
  public readonly role: UserRole;

  @IsEnum(UserLanguage)
  public readonly language: UserLanguage;

  public static readonly create = Transformer.createInstanceFactory(UserDto);
}
