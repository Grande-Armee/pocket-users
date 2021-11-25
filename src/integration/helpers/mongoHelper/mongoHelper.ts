import { TransactionalCallback } from '@grande-armee/pocket-common';
import { TestingModule } from '@nestjs/testing';

import { MongoUnitOfWork, UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

export class MongoHelper {
  public constructor(private readonly testingModule: TestingModule) {}

  public async runInTestTransaction<Result>(callback: TransactionalCallback<Result, MongoUnitOfWork>): Promise<void> {
    const unitOfWorkFactory = this.testingModule.get(UnitOfWorkFactory);
    const unitOfWork = await unitOfWorkFactory.create();

    jest.spyOn(unitOfWork, 'commit').mockImplementation(async () => {
      await unitOfWork.rollback();
    });

    await unitOfWork.runInTransaction(async () => {
      return callback(unitOfWork);
    });
  }
}
