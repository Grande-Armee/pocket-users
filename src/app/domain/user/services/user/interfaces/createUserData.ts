import { UserLanguage } from '@grande-armee/pocket-common';

export interface CreateUserData {
  readonly email: string;
  readonly password: string;
  readonly language: UserLanguage;
}
