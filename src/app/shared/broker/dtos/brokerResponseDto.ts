import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined } from 'class-validator';

export class BrokerResponseDto<Payload = any> {
  @IsBoolean()
  @Expose()
  public success: boolean;

  @IsDefined()
  @Expose()
  public payload: Payload;
}
