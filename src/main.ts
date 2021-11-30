import './pathAliases';

import { LoggerService } from '@grande-armee/pocket-common';
import { NestFactory } from '@nestjs/core';
import { setTimeout } from 'timers/promises';

import { AppModule } from './app/appModule';
import { UserTransporter } from './app/shared/broker/domain/user/userTransporter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);

  app.useLogger(logger);
  app.flushLogs();

  await app.init();

  logger.info('App initialized.');

  await setTimeout(3000);

  const userTransporter = app.get(UserTransporter);

  const res = await userTransporter.createUser({
    email: 'email@rmail.com',
    password: 'password',
  });

  console.log({ res });
}

bootstrap();
