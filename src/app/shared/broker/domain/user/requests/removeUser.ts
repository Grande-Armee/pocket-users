import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveUserPayloadDto {
  @IsUUID('4')
  @Expose()
  public readonly userId: string;
}
