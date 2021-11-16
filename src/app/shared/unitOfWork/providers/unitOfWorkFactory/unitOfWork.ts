import { LoggerService } from '@grande-armee/pocket-common';

import { DomainEventsDispatcher } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

import { ClientSession } from './interfaces';

export type TransactionalCallback<Result> = (unitOfWork: UnitOfWork) => Promise<Result>;

export class UnitOfWork {
  public constructor(
    private readonly logger: LoggerService,
    private readonly session: ClientSession,
    private readonly domainEventsDispatcher: DomainEventsDispatcher,
  ) {}

  protected async endSession(): Promise<void> {
    await this.session.endSession();
  }

  public async init(): Promise<void> {
    this.logger.debug('Starting transaction...');
    this.session.startTransaction();
    this.logger.debug('Transaction started.');
  }

  public async commit(): Promise<void> {
    this.logger.debug('Commiting transaction...');
    await this.session.commitTransaction();
    this.logger.debug('Transaction commited.');

    this.logger.debug('Dispatching domain events...');
    await this.domainEventsDispatcher.dispatch();
    this.logger.debug('Domain events dispached.');
  }

  public async rollback(): Promise<void> {
    this.logger.debug('Rolling back transaction...');
    await this.session.abortTransaction();
    this.logger.debug('Transaction rolled back.');
  }

  public getSession(): ClientSession {
    return this.session;
  }

  public getDomainEventsDispatcher(): DomainEventsDispatcher {
    return this.domainEventsDispatcher;
  }

  public async runInTransaction<Result>(callback: TransactionalCallback<Result>): Promise<Result> {
    try {
      await this.init();

      const result = await callback(this);

      await this.commit();
      await this.endSession();

      return result;
    } catch (e) {
      await this.rollback();
      await this.endSession();

      throw e;
    }
  }
}
