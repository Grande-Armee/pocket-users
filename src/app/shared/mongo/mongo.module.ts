import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfigProvider } from './providers/mongo-config';

@Global()
@Module({
  imports: [
    // CommonModule,
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      ...mongoConfigProvider,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
