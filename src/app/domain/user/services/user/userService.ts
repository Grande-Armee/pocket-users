import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { InvalidEmailOrPasswordError, UserNotFoundError } from '@domain/user/errors';
import { UserAlreadyExistsError } from '@domain/user/errors/userAlreadyExistsError';
import {
  UserPasswordChangedEvent,
  UserCreatedEvent,
  UserRemovedEvent,
  UserUpdatedEvent,
} from '@domain/user/integrationEvents';
import { MongoUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserDto } from '../../dtos/userDto';
import { UserRepositoryFactory } from '../../repositories/user/userRepository';
import { HashService } from '../hash/hashService';
import { TokenService } from '../token/tokenService';
import { LoginUserData, CreateUserData, UpdateUserData } from './types';

@Injectable()
export class UserService {
  public constructor(
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly userRepositoryFactory: UserRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async loginUser(unitOfWork: MongoUnitOfWork, loginData: LoginUserData): Promise<string> {
    this.logger.debug('Logging user...', { email: loginData.email });

    const { session } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    const { email, password } = loginData;

    const user = await userRepository.findOneByEmail(email);

    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    const isPasswordValid = await this.hashService.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidEmailOrPasswordError();
    }

    const accessToken = await this.tokenService.signAccessToken({
      id: user.id,
      role: user.role,
    });

    this.logger.info('User logged in.', { userId: user.id });

    return accessToken;
  }

  public async setNewPassword(unitOfWork: MongoUnitOfWork, userId: string, newPassword: string): Promise<UserDto> {
    this.logger.debug('Setting new password...', { userId: userId });

    const { session, integrationEventsStore } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    const user = await userRepository.updateOne(userId, {
      password: await this.hashService.hashPassword(newPassword),
    });

    integrationEventsStore.addEvent(
      new UserPasswordChangedEvent({
        userId: user.id,
      }),
    );

    this.logger.info('New password set.', { userId: user.id });

    return user;
  }

  public async createUser(unitOfWork: MongoUnitOfWork, userData: CreateUserData): Promise<UserDto> {
    this.logger.debug('Creating user...', { email: userData.email });

    const { session, integrationEventsStore } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    const { email, password, language } = userData;

    const existingUser = await userRepository.findOneByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError({ email });
    }

    const user = await userRepository.createOne({
      email,
      password: await this.hashService.hashPassword(password),
      language,
    });

    integrationEventsStore.addEvent(
      new UserCreatedEvent({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        role: user.role,
        language: user.language,
      }),
    );

    this.logger.info('User created.', { userId: user.id });

    return user;
  }

  public async findUser(unitOfWork: MongoUnitOfWork, userId: string): Promise<UserDto> {
    const { session } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    const user = await userRepository.findOneById(userId);

    if (!user) {
      throw new UserNotFoundError({ id: userId });
    }

    return user;
  }

  public async updateUser(unitOfWork: MongoUnitOfWork, userId: string, userData: UpdateUserData): Promise<UserDto> {
    this.logger.debug('Updating user...', { userId: userId });

    const { session, integrationEventsStore } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    const { language } = userData;

    const user = await userRepository.updateOne(userId, { language });

    if (!user) {
      throw new UserNotFoundError({ id: userId });
    }

    integrationEventsStore.addEvent(
      new UserUpdatedEvent({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        role: user.role,
        language: user.language,
      }),
    );

    this.logger.info('User updated.', { userId: user.id });

    return user;
  }

  public async removeUser(unitOfWork: MongoUnitOfWork, userId: string): Promise<void> {
    this.logger.debug('Removing user...', { userId: userId });

    const { session, integrationEventsStore } = unitOfWork;
    const userRepository = this.userRepositoryFactory.create(session);

    await userRepository.removeOne(userId);

    integrationEventsStore.addEvent(
      new UserRemovedEvent({
        id: userId,
      }),
    );

    this.logger.info('User removed.', { userId: userId });
  }
}
