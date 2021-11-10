// import { getConnectionToken } from '@nestjs/mongoose';
// import { TestingModule } from '@nestjs/testing';
// import { Connection } from 'mongoose';

// import { ClientSession } from '../../../app/shared/unit-of-work/providers/unit-of-work-factory';

// export class MongoHelper {
//   private session: ClientSession;

//   public constructor(private readonly testingModule: TestingModule) {}

//   public async startSessionAndMockConnection(): Promise<ClientSession> {
//     const connection = this.testingModule.get<Connection>(getConnectionToken());

//     const session = await connection.startSession();

//     session.startTransaction();

//     jest.spyOn(connection, 'startSession').mockImplementation(() => session);

//     this.session = session;

//     return session;
//   }

//   public async rollbackAndTerminateSession(): Promise<void> {
//     await this.session.abortTransaction();
//     await this.session.endSession();
//   }

//   public async runInTestTransaction(callback: (session: ClientSession) => Promise<void>): Promise<void> {
//     const session = await this.startSessionAndMockConnection();

//     try {
//       await callback(session);

//       await this.rollbackAndTerminateSession();
//     } catch (error) {
//       await this.rollbackAndTerminateSession();

//       throw error;
//     }
//   }
// }

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
