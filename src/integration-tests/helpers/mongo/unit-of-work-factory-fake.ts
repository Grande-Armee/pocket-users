import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { TransactionalCallback, UnitOfWork } from '../../../app/mongo/providers/unit-of-work-factory';

@Injectable()
export class UnitOfWorkFactoryFake {
  public constructor(@InjectConnection() private connection: Connection) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();

    const fake = new UnitOfWork(session);

    jest
      .spyOn(fake, 'runInTransaction')
      .mockImplementation(async (callback: TransactionalCallback<unknown>) => callback(session));

    return fake;
  }
}
