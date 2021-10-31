import { EnvVariables, ENV_VARIABLES_TOKEN } from '@grande-armee/pocket-common/dist/common/env/providers/env-variables';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { AppModule } from '../../../app/app.module';
import { UnitOfWork, UnitOfWorkFactory } from '../../../app/mongo/providers/unit-of-work';

class UnitOfWorkFake extends UnitOfWork {
  // TODO: disable this rule
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public override async commit(): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected override async endSession(): Promise<void> {}
}

@Injectable()
export class FakeUnitOfWorkFactory {
  public constructor(@InjectConnection() private connection: Connection) {}

  public async create(): Promise<UnitOfWork> {
    const session = await this.connection.startSession();

    return new UnitOfWorkFake(session);
  }
}

export class TestModuleHelper {
  private builder: TestingModuleBuilder;

  public constructor() {
    this.builder = Test.createTestingModule({
      imports: [AppModule],
    });
  }

  public overrideEnvVariables(): TestModuleHelper {
    this.builder = this.builder.overrideProvider(ENV_VARIABLES_TOKEN).useValue({ ...this.getEnvVariables() });

    return this;
  }

  public overrideUnitOfWork(): TestModuleHelper {
    this.builder = this.builder.overrideProvider(UnitOfWorkFactory).useClass(FakeUnitOfWorkFactory);

    return this;
  }

  private getEnvVariables(): EnvVariables {
    return {
      SHOULD_PRETTIFY_LOGS: true,
      MONGODB_ROOT_USERNAME: `root`,
      MONGODB_ROOT_PASSWORD: `password`,
      MONGODB_USERNAME: `pocket`,
      MONGODB_PASSWORD: `password`,
      MONGODB_DATABASE_NAME: `pocket-users`,
      MONGODB_URI: 'mongodb://pocket:password@mongo:27017/pocket-users',
      RABBITMQ_URI: `amqp://username:password@rabbitmq:5672`,
      APP_NAME: `pocket-users`,
    };
  }

  public async init(): Promise<TestingModule> {
    return this.builder.compile();
  }

  public static async createTestingModule(): Promise<TestingModule> {
    return new TestModuleHelper().overrideEnvVariables().overrideUnitOfWork().init();
  }
}
