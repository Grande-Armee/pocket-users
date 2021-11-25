import { IntegrationEventsDispatcherFactory, LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MongoUnitOfWork } from './unitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly integrationEventsDispatcherFactory: IntegrationEventsDispatcherFactory,
    private readonly logger: LoggerService,
  ) {}

  public async create(): Promise<MongoUnitOfWork> {
    const session = await this.connection.startSession();
    const integrationEventsDispatcher = this.integrationEventsDispatcherFactory.create();

    return new MongoUnitOfWork(this.logger, integrationEventsDispatcher, session);
  }
}
