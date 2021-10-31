import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfigProvider } from './providers/mongo-config';
import { UnitOfWorkFactory } from './providers/unit-of-work';

@Global()
@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      ...mongoConfigProvider,
    }),
  ],
  providers: [UnitOfWorkFactory],
  exports: [MongooseModule, UnitOfWorkFactory],
})
export class MongoModule {}
