import { MongooseModuleOptions } from '@nestjs/mongoose';

export interface MongoConfig extends MongooseModuleOptions {
  readonly uri: string;
}
