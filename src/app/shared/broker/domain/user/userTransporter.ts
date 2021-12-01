import { Injectable } from '@nestjs/common';

import { FindUserPayloadDto, FindUserResponseDto } from '@shared/broker/domain/user/requests/findUser';
import { LoginUserPayloadDto, LoginUserResponseDto } from '@shared/broker/domain/user/requests/loginUser';
import { RemoveUserPayloadDto } from '@shared/broker/domain/user/requests/removeUser';
import {
  SetNewPasswordPayloadDto,
  SetNewPasswordResponseDto,
} from '@shared/broker/domain/user/requests/setNewPassword';
import { UpdateUserPayloadDto, UpdateUserResponseDto } from '@shared/broker/domain/user/requests/updateUser';

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

  public async findUser(payload: FindUserPayloadDto): Promise<FindUserResponseDto> {
    const data = this.brokerService.createRpcData(FindUserPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.findUser, data);
  }

  public async updateUser(payload: UpdateUserPayloadDto): Promise<UpdateUserResponseDto> {
    const data = this.brokerService.createRpcData(UpdateUserPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.updateUser, data);
  }

  public async removeUser(payload: RemoveUserPayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveUserPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.removeUser, data);
  }

  public async loginUser(payload: LoginUserPayloadDto): Promise<LoginUserResponseDto> {
    const data = this.brokerService.createRpcData(LoginUserPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.loginUser, data);
  }

  public async setNewPassword(payload: SetNewPasswordPayloadDto): Promise<SetNewPasswordResponseDto> {
    const data = this.brokerService.createRpcData(SetNewPasswordPayloadDto, payload);

    return this.brokerService.request(UserRoutingKey.setNewPassword, data);
  }
}
