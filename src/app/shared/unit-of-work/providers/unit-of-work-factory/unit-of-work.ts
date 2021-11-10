import { LoggerService } from '@nestjs/common';

import { DomainEventsDispatcher } from '../../../domain-events-dispatcher/providers/domain-events-dispatcher-factory';
import { ClientSession } from './interfaces';

export type TransactionalCallback<Result> = (unitOfWork: UnitOfWork) => Promise<Result>;

export class UnitOfWork {
  public constructor(
    private readonly loggerService: LoggerService,
    private readonly session: ClientSession,
    private readonly domainEventsDispatcher: DomainEventsDispatcher,
  ) {}

  protected async endSession(): Promise<void> {
    await this.session.endSession();
  }

  public async init(): Promise<void> {
    this.loggerService.log('Starting transaction...');
    this.session.startTransaction();
    this.loggerService.log('Transaction started.');
  }

  public async commit(): Promise<void> {
    this.loggerService.log('Commiting transaction...');
    await this.session.commitTransaction();
    this.loggerService.log('Transaction commited.');

    this.loggerService.log('Dispatching domain events...');
    await this.domainEventsDispatcher.dispatch();
    this.loggerService.log('Domain events dispached.');
  }

  public async rollback(): Promise<void> {
    this.loggerService.log('Rolling back transaction...');
    await this.session.abortTransaction();
    this.loggerService.log('Transaction rolled back.');
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
