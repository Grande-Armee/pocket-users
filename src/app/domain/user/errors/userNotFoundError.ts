import { DomainError } from '@grande-armee/pocket-common';

export interface UserNotFoundErrorContextWithId {
  readonly id: string;
}

export interface UserNotFoundErrorContextWithEmail {
  readonly email: string;
}

export class UserNotFoundError extends DomainError<UserNotFoundErrorContextWithId | UserNotFoundErrorContextWithEmail> {
  public constructor(context: UserNotFoundErrorContextWithId | UserNotFoundErrorContextWithEmail) {
    super(`User with the provided param not found.`, context);
  }
}
