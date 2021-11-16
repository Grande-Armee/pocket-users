import { Expose } from 'class-transformer';

import { UserLanguage } from '../entities/types/userLanguage';
import { UserRole } from '../entities/types/userRole';

export class UserDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly email: string;

  @Expose()
  public readonly password: string;

  @Expose()
  public readonly role: UserRole;

  @Expose()
  public readonly language: UserLanguage;
}
