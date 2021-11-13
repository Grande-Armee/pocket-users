import { Module } from '@nestjs/common';

import { DomainModule } from './domain/domainModule';
import { SharedModule } from './shared/sharedModule';

@Module({
  imports: [SharedModule, DomainModule],
})
export class AppModule {}
