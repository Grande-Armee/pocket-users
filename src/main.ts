import { LoggerService } from '@grande-armee/pocket-common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/appModule';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [String(process.env.RABBITMQ_URI)], // Can't use DI here -> process.env
    },
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));
  app.flushLogs();

  await app.listen();
}

bootstrap();
