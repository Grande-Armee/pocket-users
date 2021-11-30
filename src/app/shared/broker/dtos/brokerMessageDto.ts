import { Type, Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { BrokerMessageContextDto } from './brokerMessageContextDto';
import { BrokerMessageDataDto } from './brokerMessageDataDto';

export class BrokerMessageDto {
  @Type(() => BrokerMessageDataDto)
  @ValidateNested()
  @Expose()
  public readonly data: BrokerMessageDataDto;

  @Type(() => BrokerMessageContextDto)
  @ValidateNested()
  @Expose()
  public readonly context: BrokerMessageContextDto;
}
