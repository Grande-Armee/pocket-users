import { EnvVariables, ENV_VARIABLES } from '@grande-armee/pocket-common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

import { AppModule } from '../../../app/app.module';
import { UnitOfWorkFactory } from '../../../app/mongo/providers/unit-of-work-factory';
import { UnitOfWorkFactoryFake } from '../mongo/unit-of-work-factory-fake';

export class TestModuleHelper {
  private builder: TestingModuleBuilder;

  public constructor() {
    this.builder = Test.createTestingModule({
      imports: [AppModule],
    });
  }

  public overrideEnvVariables(): TestModuleHelper {
    this.builder = this.builder.overrideProvider(ENV_VARIABLES).useValue({ ...this.getEnvVariables() });

    return this;
  }

  public overrideUnitOfWork(): TestModuleHelper {
    this.builder = this.builder.overrideProvider(UnitOfWorkFactory).useClass(UnitOfWorkFactoryFake);

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
      AUTH_HASH_SALT_ROUNDS: 15,
      AUTH_JWT_SECRET: `01234567890123456789012345`,
      AUTH_JWT_EXPIRES_IN: 86400,
    };
  }

  public async init(): Promise<TestingModule> {
    return this.builder.compile();
  }

  public static async createTestingModule(): Promise<TestingModule> {
    return new TestModuleHelper().overrideEnvVariables().overrideUnitOfWork().init();
  }
}
