import { CommonModule } from '@grande-armee/pocket-common';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongoConfigProvider } from './providers/mongo-config';

@Module({})
export class MongoModule {
  public static forRoot(): DynamicModule {
    return MongooseModule.forRootAsync({
      imports: [CommonModule],
      ...mongoConfigProvider,
    });
  }
}
