import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { DomainEventsDispatcherFactory } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

import { UnitOfWork } from './unitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly domainEventsDispatcherFactory: DomainEventsDispatcherFactory,
    private readonly logger: LoggerService,
  ) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();
    const domainEventsDispatcher = this.domainEventsDispatcherFactory.create();

    return new UnitOfWork(this.logger, session, domainEventsDispatcher);
  }
}
