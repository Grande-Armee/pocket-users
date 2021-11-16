import { UserLanguage } from '../../../entities/types/userLanguage';

export interface CreateUserData {
  readonly email: string;
  readonly password: string;
  readonly language: UserLanguage;
}
