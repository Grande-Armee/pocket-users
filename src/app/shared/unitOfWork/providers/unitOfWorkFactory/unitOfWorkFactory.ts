import { IntegrationEventsStoreFactory, LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MongoUnitOfWork } from './unitOfWork';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(
    @InjectConnection() private connection: Connection,
    private readonly integrationEventsStoreFactory: IntegrationEventsStoreFactory,
    private readonly logger: LoggerService,
  ) {}

  public async create(): Promise<MongoUnitOfWork> {
    const session = await this.connection.startSession();
    const integrationEventsStore = this.integrationEventsStoreFactory.create();

    return new MongoUnitOfWork(this.logger, integrationEventsStore, session);
  }
}
