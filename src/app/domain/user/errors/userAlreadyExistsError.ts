import { DomainError } from '@grande-armee/pocket-common';

export interface UserAlreadyExistsErrorContext {
  readonly email: string;
}

export class UserAlreadyExistsError extends DomainError<UserAlreadyExistsErrorContext> {
  public constructor(context: UserAlreadyExistsErrorContext) {
    super(`User with provided email already exists.`, context);
  }
}
