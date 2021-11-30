import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CreateUserPayloadDto, CreateUserResponseDto } from './requests/createUser';
import { UserRoutingKey } from './userRoutingKey';

@Injectable()
export class UserTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createUser(payload: CreateUserPayloadDto): Promise<CreateUserResponseDto> {
    const data = this.brokerService.createRpcData(CreateUserPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.createUser, data);
  }
}
