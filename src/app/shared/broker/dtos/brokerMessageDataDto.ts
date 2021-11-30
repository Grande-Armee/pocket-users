import { Expose } from 'class-transformer';
import { IsString, IsObject } from 'class-validator';

export class BrokerMessageDataDto {
  @IsString()
  @Expose()
  public readonly id: string;

  @IsString()
  @Expose()
  public readonly timestamp: string;

  @IsObject()
  @Expose()
  public readonly payload: any;
}
