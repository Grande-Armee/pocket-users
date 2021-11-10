import { Module } from '@nestjs/common';

import { unitOfWorkFactoryProvider } from './providers/unit-of-work-factory';

@Module({
  providers: [unitOfWorkFactoryProvider],
  exports: [unitOfWorkFactoryProvider],
})
export class UnitOfWorkModule {}
