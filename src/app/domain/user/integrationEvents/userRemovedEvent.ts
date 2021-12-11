import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface UserRemovedEventPayload {
  readonly id: string;
}

export class UserRemovedEvent extends IntegrationEvent<UserRemovedEventPayload> {
  public readonly name = 'pocket.users.users.userRemoved';
}
