import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class BrokerMessageContextDto {
  @IsString()
  @Expose()
  public readonly traceId: string;

  @IsString()
  @Expose()
  public readonly timestamp: string;
}
