import { LoggerService, IntegrationEventsStore, UnitOfWork } from '@grande-armee/pocket-common';

import { ClientSession } from './types';

export class MongoUnitOfWork extends UnitOfWork {
  public constructor(
    protected override readonly logger: LoggerService,
    public override readonly integrationEventsStore: IntegrationEventsStore,
    public readonly session: ClientSession,
  ) {
    super(logger, integrationEventsStore);
  }

  public async init(): Promise<void> {
    this.session.startTransaction();
  }

  public async commit(): Promise<void> {
    await this.session.commitTransaction();
  }

  public async rollback(): Promise<void> {
    await this.session.abortTransaction();
  }

  public async cleanUp(): Promise<void> {
    await this.session.endSession();
  }
}
