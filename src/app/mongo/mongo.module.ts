import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfigProvider } from './providers/mongo-config';
import { unitOfWorkFactoryProvider } from './providers/unit-of-work-factory';

@Global()
@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      ...mongoConfigProvider,
    }),
  ],
  providers: [unitOfWorkFactoryProvider],
  exports: [MongooseModule, unitOfWorkFactoryProvider],
})
export class MongoModule {}
