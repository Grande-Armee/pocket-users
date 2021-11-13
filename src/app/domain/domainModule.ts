import { Module } from '@nestjs/common';

import { UserModule } from './user/userModule';

@Module({
  imports: [UserModule],
  exports: [UserModule],
})
export class DomainModule {}
