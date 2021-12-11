import { IntegrationEvent, UserLanguage, UserRole } from '@grande-armee/pocket-common';

export interface SetNewPasswordEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly language: UserLanguage;
}

export class SetNewPasswordEvent extends IntegrationEvent<SetNewPasswordEventPayload> {
  public readonly name = 'pocket.users.auth.setNewPassword';
}
