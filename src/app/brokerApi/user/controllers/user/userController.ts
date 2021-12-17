import {
  BrokerController,
  BrokerMessage,
  BrokerService,
  CreateUserPayloadDto,
  CreateUserResponseDto,
  FindUserPayloadDto,
  FindUserResponseDto,
  LoginUserPayloadDto,
  LoginUserResponseDto,
  RemoveUserPayloadDto,
  RpcRoute,
  SetNewPasswordPayloadDto,
  SetNewPasswordResponseDto,
  UpdateUserPayloadDto,
  UpdateUserResponseDto,
  UserRoutingKey,
} from '@grande-armee/pocket-common';

import { UserService } from '@domain/user/services/user/userService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class UserBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly userService: UserService,
  ) {}

  @RpcRoute(UserRoutingKey.createUser)
  public async createUser(_: unknown, message: BrokerMessage): Promise<CreateUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateUserPayloadDto.create(data.payload);

    const user = await unitOfWork.runInTransaction(async () => {
      const { email, password, language } = payload;

      const user = await this.userService.createUser(unitOfWork, {
        email,
        password,
        language,
      });

      return user;
    });

    const result = CreateUserResponseDto.create({
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

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserRoutingKey.findUser)
  public async findUser(_: unknown, message: BrokerMessage): Promise<FindUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = FindUserPayloadDto.create(data.payload);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId } = payload;

      const user = await this.userService.findUser(unitOfWork, userId);

      return user;
    });

    return FindUserResponseDto.create({
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

    const { data } = await this.brokerService.parseMessage(message);
    const payload = UpdateUserPayloadDto.create(data.payload);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId, language } = payload;

      const user = await this.userService.updateUser(unitOfWork, userId, { language });

      return user;
    });

    const result = UpdateUserResponseDto.create({
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

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserRoutingKey.removeUser)
  public async removeUser(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveUserPayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { userId } = payload;

      await this.userService.removeUser(unitOfWork, userId);
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }

  @RpcRoute(UserRoutingKey.loginUser)
  public async loginUser(_: unknown, message: BrokerMessage): Promise<LoginUserResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = LoginUserPayloadDto.create(data.payload);

    const token = await unitOfWork.runInTransaction(async () => {
      const { email, password } = payload;

      const token = await this.userService.loginUser(unitOfWork, {
        email,
        password,
      });

      return token;
    });

    return LoginUserResponseDto.create({ token });
  }

  @RpcRoute(UserRoutingKey.setNewPassword)
  public async setNewPassword(_: unknown, message: BrokerMessage): Promise<SetNewPasswordResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = SetNewPasswordPayloadDto.create(data.payload);

    const user = await unitOfWork.runInTransaction(async () => {
      const { userId, newPassword } = payload;

      const user = await this.userService.setNewPassword(unitOfWork, userId, newPassword);

      return user;
    });

    const result = SetNewPasswordResponseDto.create({
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

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }
}
