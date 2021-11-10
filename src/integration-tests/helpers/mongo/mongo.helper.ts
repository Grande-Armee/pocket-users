import { TestingModule } from '@nestjs/testing';

import {
  TransactionalCallback,
  UnitOfWorkFactory,
} from '../../../app/shared/unit-of-work/providers/unit-of-work-factory';

export class MongoHelper {
  public constructor(private readonly testingModule: TestingModule) {}

  public async runInTestTransaction<Result>(callback: TransactionalCallback<Result>): Promise<void> {
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
