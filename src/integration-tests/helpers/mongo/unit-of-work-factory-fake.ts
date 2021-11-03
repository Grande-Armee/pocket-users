import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { UnitOfWork } from '../../../app/mongo/providers/unit-of-work-factory';

class UnitOfWorkFake extends UnitOfWork {
  // TODO: disable this rule
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public override async commit(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected override async endSession(): Promise<void> {}
}

@Injectable()
export class UnitOfWorkFactoryFake {
  public constructor(@InjectConnection() private connection: Connection) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();

    return new UnitOfWorkFake(session);
  }
}
