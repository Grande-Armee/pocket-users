import { ClientSession } from './interfaces';

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
