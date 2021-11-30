import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import { CreateUserPayloadDto, CreateUserResponseDto } from '@shared/broker/domain/user/requests/createUser';
import { UserRoutingKey } from '@shared/broker/domain/user/userRoutingKey';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';

@BrokerController()
export class UserBrokerController {
  public constructor(private readonly brokerService: BrokerService, private readonly dtoFactory: DtoFactory) {}

  @RpcRoute(UserRoutingKey.createUser)
  public async createUser(_: unknown, message: BrokerMessage): Promise<CreateUserResponseDto> {
    const { data } = await this.brokerService.parseMessage(CreateUserPayloadDto, message);

    console.log({ data });

    return this.dtoFactory.createDtoInstance(CreateUserResponseDto, {
      user: {
        id: '123',
      },
    });
  }
}
