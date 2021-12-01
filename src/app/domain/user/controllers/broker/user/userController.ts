import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import { CreateUserPayloadDto, CreateUserResponseDto } from '@shared/broker/domain/user/requests/createUser';
import { FindUserPayloadDto, FindUserResponseDto } from '@shared/broker/domain/user/requests/findUser';
import { LoginUserPayloadDto, LoginUserResponseDto } from '@shared/broker/domain/user/requests/loginUser';
import { RemoveUserPayloadDto } from '@shared/broker/domain/user/requests/removeUser';
import {
  SetNewPasswordPayloadDto,
  SetNewPasswordResponseDto,
} from '@shared/broker/domain/user/requests/setNewPassword';
import { UpdateUserPayloadDto, UpdateUserResponseDto } from '@shared/broker/domain/user/requests/updateUser';
import { UserRoutingKey } from '@shared/broker/domain/user/userRoutingKey';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserService } from '../../../services/user/userService';

@BrokerController()
export class UserBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly userService: UserService,
  ) {}

  @RpcRoute(UserRoutingKey.createUser)
  public async createUser(_: unknown, message: BrokerMessage): Promise<CreateUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateUserPayloadDto, message);

    const user = await unitOfWork.runInTransaction(async () => {
      const { email, password, language } = data.payload;

      const user = await this.userService.createUser(unitOfWork, {
        email,
        password,
        language,
      });

      return user;
    });

    return this.dtoFactory.createDtoInstance(CreateUserResponseDto, {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        password: user.password,
        language: user.language,
        role: user.role,
      },
    });
  }

  @RpcRoute(UserRoutingKey.findUser)
  public async findUser(_: unknown, message: BrokerMessage): Promise<FindUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindUserPayloadDto, message);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId } = data.payload;

      const user = await this.userService.findUser(unitOfWork, userId);

      return user;
    });

    return this.dtoFactory.createDtoInstance(FindUserResponseDto, {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        password: user.password,
        language: user.language,
        role: user.role,
      },
    });
  }

  @RpcRoute(UserRoutingKey.updateUser)
  public async updateUser(_: unknown, message: BrokerMessage): Promise<UpdateUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(UpdateUserPayloadDto, message);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId, language } = data.payload;

      const user = await this.userService.updateUser(unitOfWork, userId, { language });

      return user;
    });

    return this.dtoFactory.createDtoInstance(UpdateUserResponseDto, {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        password: user.password,
        language: user.language,
        role: user.role,
      },
    });
  }

  @RpcRoute(UserRoutingKey.removeUser)
  public async removeUser(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveUserPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { userId } = data.payload;

      await this.userService.removeUser(unitOfWork, userId);
    });
  }

  @RpcRoute(UserRoutingKey.loginUser)
  public async loginUser(_: unknown, message: BrokerMessage): Promise<LoginUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(LoginUserPayloadDto, message);

    const token = await unitOfWork.runInTransaction(async () => {
      const { email, password } = data.payload;

      const token = await this.userService.loginUser(unitOfWork, {
        email,
        password,
      });

      return token;
    });

    return this.dtoFactory.createDtoInstance(LoginUserResponseDto, { token });
  }

  @RpcRoute(UserRoutingKey.setNewPassword)
  public async setNewPassword(_: unknown, message: BrokerMessage): Promise<SetNewPasswordResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(SetNewPasswordPayloadDto, message);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId, newPassword } = data.payload;

      const user = await this.userService.setNewPassword(unitOfWork, userId, newPassword);

      return user;
    });

    return this.dtoFactory.createDtoInstance(SetNewPasswordResponseDto, {
      user: {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        password: user.password,
        language: user.language,
        role: user.role,
      },
    });
  }
}
