import { EntityTestDataGenerator, NonNullableEntity, UserLanguage, UserRole } from '@grande-armee/pocket-common';
import { internet, datatype, date, helpers } from 'faker';

import { User } from '../entities/user';

type UserTestData = NonNullableEntity<Omit<User, ''>>;

export class UserTestDataGenerator implements EntityTestDataGenerator<UserTestData> {
  public generateEntityData(): UserTestData {
    return {
      _id: this.generate_id(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      email: this.generateEmail(),
      password: this.generatePassword(),
      language: this.generateLanguage(),
      role: this.generateRole(),
      isActive: this.generateIsActive(),
    };
  }

  public generate_id(): string {
    return datatype.uuid();
  }

  public generateCreatedAt(): Date {
    return date.recent(3);
  }

  public generateUpdatedAt(): Date {
    return date.recent(1);
  }

  public generateEmail(): string {
    return internet.email();
  }

  public generatePassword(): string {
    return internet.password(24);
  }

  public generateLanguage(): UserLanguage {
    return helpers.randomize([UserLanguage.en, UserLanguage.pl]);
  }

  public generateRole(): UserRole {
    return UserRole.user;
  }

  public generateIsActive(): boolean {
    return datatype.boolean();
  }
}
