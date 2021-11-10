import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { DomainEventsDispatcherFactory } from '../../../domain-events-dispatcher/providers/domain-events-dispatcher-factory';
import { UnitOfWork } from './unit-of-work';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly domainEventsDispatcherFactory: DomainEventsDispatcherFactory,
    private readonly loggerService: LoggerService,
  ) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();
    const domainEventsDispatcher = this.domainEventsDispatcherFactory.create();

    return new UnitOfWork(this.loggerService, session, domainEventsDispatcher);
  }
}
