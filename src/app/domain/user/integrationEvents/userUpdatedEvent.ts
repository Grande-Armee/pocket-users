import { IntegrationEvent, UserLanguage, UserRole } from '@grande-armee/pocket-common';

export interface UserUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly language: UserLanguage;
}

export class UserUpdatedEvent extends IntegrationEvent<UserUpdatedEventPayload> {
  public readonly name = 'pocket.users.users.userUpdated';
}
