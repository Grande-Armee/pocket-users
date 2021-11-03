import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UnitOfWork } from './unit-of-work';

@Injectable()
export class UnitOfWorkFactory {
  public constructor(@InjectConnection() private connection: Connection) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();

    return new UnitOfWork(session);
  }
}
