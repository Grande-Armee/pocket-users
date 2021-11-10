import { Module } from '@nestjs/common';

import { DomainModule } from './domain/domain.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, DomainModule],
})
export class AppModule {}
