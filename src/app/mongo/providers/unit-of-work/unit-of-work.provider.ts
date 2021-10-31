import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { ClientSession } from './interfaces/client-session.interface';

export type TransactionalCallback<Result> = (session: ClientSession) => Promise<Result>;

export class UnitOfWork {
  public constructor(private readonly session: ClientSession) {}

  protected endSession(): Promise<void> {
    return this.session.endSession();
  }

  public getSession(): ClientSession {
    return this.session;
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

  public async runInTransaction<Result>(callback: TransactionalCallback<Result>): Promise<Result> {
    try {
      await this.init();

      const result = await callback(this.session);

      await this.commit();
      await this.endSession();

      return result;
    } catch (e) {
      await this.rollback();

      throw e;
    }
  }
}

@Injectable()
export class UnitOfWorkFactory {
  public constructor(@InjectConnection() private connection: Connection) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();

    return new UnitOfWork(session);
  }
}
