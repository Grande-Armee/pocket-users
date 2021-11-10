import { Injectable } from '@nestjs/common';

import { DomainEventsDispatcher } from './domain-events-dispatcher';

@Injectable()
export class DomainEventsDispatcherFactory {
  public constructor() {}

  public create(): DomainEventsDispatcher {
    // TODO: brokerService
    return new DomainEventsDispatcher({
      dispatch: (): void => {},
    });
  }
}
