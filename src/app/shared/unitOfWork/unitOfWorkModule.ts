import { Module } from '@nestjs/common';

import { unitOfWorkFactoryProvider } from './providers/unitOfWorkFactory';

@Module({
  providers: [unitOfWorkFactoryProvider],
  exports: [unitOfWorkFactoryProvider],
})
export class UnitOfWorkModule {}
