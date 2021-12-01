import { Expose } from 'class-transformer';

import { UserLanguage } from '@domain/user/entities/types/userLanguage';
import { UserRole } from '@domain/user/entities/types/userRole';

export class UserDto {
  @Expose()
  public id: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public email: string;

  @Expose()
  public password: string;

  @Expose()
  public role: UserRole;

  @Expose()
  public language: UserLanguage;
}
