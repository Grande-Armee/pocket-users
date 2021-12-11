import { DomainError } from '@grande-armee/pocket-common';

export interface UserNotFoundErrorContext {
  readonly id: string;
}

export class UserNotFoundError extends DomainError<UserNotFoundErrorContext> {
  public constructor(context: UserNotFoundErrorContext) {
    super(`User with the provided id not found.`, context);
  }
}
