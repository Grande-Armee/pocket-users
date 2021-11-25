import { Module } from '@nestjs/common';

import { UnitOfWorkFactory } from './providers/unitOfWorkFactory';

@Module({
  providers: [UnitOfWorkFactory],
  exports: [UnitOfWorkFactory],
})
export class UnitOfWorkModule {}
