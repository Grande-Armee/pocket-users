import { CommonModule } from '@grande-armee/pocket-common';
import { Global, Module } from '@nestjs/common';

import { MongoModule } from './mongo/mongoModule';
import { UnitOfWorkModule } from './unitOfWork/unitOfWorkModule';

@Global()
@Module({
  imports: [CommonModule, MongoModule, UnitOfWorkModule],
  exports: [CommonModule, MongoModule, UnitOfWorkModule],
})
export class SharedModule {}
