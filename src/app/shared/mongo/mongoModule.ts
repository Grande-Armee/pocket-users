import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from '@shared/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(config.database.uri, {
      appName: config.appName,
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
