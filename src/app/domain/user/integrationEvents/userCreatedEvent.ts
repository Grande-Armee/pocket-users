import { IntegrationEvent, UserLanguage, UserRole } from '@grande-armee/pocket-common';

export interface UserCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly language: UserLanguage;
}

export class UserCreatedEvent extends IntegrationEvent<UserCreatedEventPayload> {
  public readonly name = 'pocket.users.users.userCreated';
}
