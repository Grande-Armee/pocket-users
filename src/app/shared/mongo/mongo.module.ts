import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfigProvider } from './providers/mongo-config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [],
      ...mongoConfigProvider,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
