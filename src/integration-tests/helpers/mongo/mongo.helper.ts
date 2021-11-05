import { getConnectionToken } from '@nestjs/mongoose';
import { TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { ClientSession } from '../../../app/mongo/providers/unit-of-work-factory';

export class MongoHelper {
  private session: ClientSession;

  public constructor(private readonly testingModule: TestingModule) {}

  public async startSessionAndMockConnection(): Promise<ClientSession> {
    const connection = this.testingModule.get<Connection>(getConnectionToken());

    const session = await connection.startSession();

    jest.spyOn(connection, 'startSession').mockImplementation(() => session);

    this.session = session;

    return session;
  }

  public async rollbackAndTerminateSession(): Promise<void> {
    await this.session.abortTransaction();
    await this.session.endSession();
    console.log('XXXXXXXXX');
  }

  public async runInTestTransaction(callback: (session: ClientSession) => Promise<void>): Promise<void> {
    const session = await this.startSessionAndMockConnection();

    try {
      await callback(session);
      await this.rollbackAndTerminateSession();
    } catch (error) {
      await this.rollbackAndTerminateSession();
      throw error;
    }
  }
}
