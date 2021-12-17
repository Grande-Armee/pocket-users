import {
  UserAlreadyExistsError,
  UserCreatedEvent,
  UserLanguage,
  UserNotFoundError,
  UserPasswordChangedEvent,
  UserRemovedEvent,
  UserUpdatedEvent,
} from '@grande-armee/pocket-common';
import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { MongoHelper } from '@integration/helpers/mongoHelper/mongoHelper';
import { LoggerModule } from '@shared/logger/loggerModule';
import { MongoModule } from '@shared/mongo/mongoModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserDto } from '../../dtos/userDto';
import { UserRepositoryFactory } from '../../repositories/user/userRepository';
import { UserTestDataGenerator } from '../../testDataGenerators/userTestDataGenerator';
import { HashService } from '../hash/hashService';
import { TokenService } from '../token/tokenService';
import { UserService } from './userService';

describe('UserService', () => {
  let testingModule: TestingModule;
  let mongoHelper: MongoHelper;
  let userTestDataGenerator: UserTestDataGenerator;

  let userService: UserService;
  let userRepositoryFactory: UserRepositoryFactory;
  let tokenService: TokenService;
  let hashService: HashService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [LoggerModule, MongoModule, UnitOfWorkModule, DomainModule],
    }).compile();

    mongoHelper = new MongoHelper(testingModule);
    userTestDataGenerator = new UserTestDataGenerator();

    userService = testingModule.get(UserService);
    userRepositoryFactory = testingModule.get(UserRepositoryFactory);
    tokenService = testingModule.get(TokenService);
    hashService = testingModule.get(HashService);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create user', () => {
    it('creates a user in the database', async () => {
      expect.assertions(8);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session, integrationEventsStore } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password, language } = userTestDataGenerator.generateEntityData();

        const userDto = await userService.createUser(unitOfWork, {
          email,
          password,
          language,
        });

        expect(userDto.email).toBe(email);
        expect(await hashService.comparePasswords(password, userDto.password)).toBeTruthy();
        expect(userDto.language).toBe(language);

        const user = (await userRepository.findOneById(userDto.id)) as UserDto;

        expect(user).not.toBeNull();
        expect(await hashService.comparePasswords(password, user.password)).toBeTruthy();
        expect(user?.email).toBe(email);

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserCreatedEvent);
      });
    });

    it('should not create new user when user with given email already exists', async () => {
      expect.assertions(2);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password, language } = userTestDataGenerator.generateEntityData();

        await userRepository.createOne({
          email,
          password,
          language,
        });

        try {
          await userService.createUser(unitOfWork, {
            email,
            password,
            language,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(UserAlreadyExistsError);
        }

        const users = await userRepository.findAll();

        expect(users).toHaveLength(1);
      });
    });
  });

  describe('Log in user', () => {
    it('should not log in user when user with email not found', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { email, password } = userTestDataGenerator.generateEntityData();

        try {
          await userService.loginUser(unitOfWork, {
            email,
            password,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });

    it('should not log in user when user password does not match', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password, language } = userTestDataGenerator.generateEntityData();

        const { password: invalidPassword } = userTestDataGenerator.generateEntityData();

        const hashedPassword = await hashService.hashPassword(password);

        await userRepository.createOne({
          email,
          password: hashedPassword,
          language,
        });

        try {
          await userService.loginUser(unitOfWork, {
            email,
            password: invalidPassword,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });

    it('log in user and return access token', async () => {
      expect.assertions(3);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password, language } = userTestDataGenerator.generateEntityData();

        const hashedPassword = await hashService.hashPassword(password);

        const user = await userRepository.createOne({
          email,
          password: hashedPassword,
          language,
        });

        const token = await userService.loginUser(unitOfWork, {
          email,
          password,
        });

        expect(typeof token).toBe('string');

        const tokenPayload = await tokenService.verifyAccessToken<Record<string, string>>(token);

        expect(tokenPayload.id).toBe(user.id);
        expect(tokenPayload.role).toBe(user.role);
      });
    });
  });

  describe('Set new password', () => {
    it('should throw if user id not found', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { _id: userId, password: newPassword } = userTestDataGenerator.generateEntityData();

        try {
          await userService.setNewPassword(unitOfWork, userId, newPassword);
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });

    it('should change user password when user is found', async () => {
      expect.assertions(5);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session, integrationEventsStore } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password, language } = userTestDataGenerator.generateEntityData();
        const { password: newPassword } = userTestDataGenerator.generateEntityData();

        const hashedPassword = await hashService.hashPassword(password);

        const user = await userRepository.createOne({
          email,
          password: hashedPassword,
          language,
        });

        const userDto = await userService.setNewPassword(unitOfWork, user.id, newPassword);

        expect(await hashService.comparePasswords(newPassword, userDto.password)).toBe(true);

        const userInDb = (await userRepository.findOneById(userDto.id)) as UserDto;

        expect(userInDb).not.toBeNull();
        expect(await hashService.comparePasswords(newPassword, userInDb.password)).toBe(true);

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserPasswordChangedEvent);
      });
    });
  });

  describe('Find user', () => {
    it('finds a user in the database', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password } = userTestDataGenerator.generateEntityData();

        const userDto = await userRepository.createOne({
          email,
          password,
        });

        const user = await userService.findUser(unitOfWork, userDto.id);

        expect(user).not.toBeNull();
      });
    });

    it('attempts to find a non-existent user', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { _id: userId } = userTestDataGenerator.generateEntityData();

        try {
          await userService.findUser(unitOfWork, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });
  });

  describe('Update user', () => {
    it('updates user data in the database', async () => {
      expect.assertions(3);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session, integrationEventsStore } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password } = userTestDataGenerator.generateEntityData();

        const language = UserLanguage.en;
        const newLanguage = UserLanguage.pl;

        const userDto = await userRepository.createOne({
          email,
          password,
          language,
        });

        await userService.updateUser(unitOfWork, userDto.id, {
          language: newLanguage,
        });

        const user = await userRepository.findOneById(userDto.id);

        expect(user?.language).toBe(newLanguage);

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserUpdatedEvent);
      });
    });

    it('tries updating non-existent user', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { _id: userId, language } = userTestDataGenerator.generateEntityData();

        try {
          await userService.updateUser(unitOfWork, userId, { language });
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });
  });

  describe('Remove user', () => {
    it('removes a user from the databse', async () => {
      expect.assertions(3);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { session, integrationEventsStore } = unitOfWork;
        const userRepository = userRepositoryFactory.create(session);

        const { email, password } = userTestDataGenerator.generateEntityData();

        const userDto = await userRepository.createOne({
          email,
          password,
        });

        await userService.removeUser(unitOfWork, userDto.id);

        const user = await userRepository.findOneById(userDto.id);

        expect(user).toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserRemovedEvent);
      });
    });

    it('tries removing a user not in the databse', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const { _id: userId } = userTestDataGenerator.generateEntityData();

        try {
          await userService.removeUser(unitOfWork, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(UserNotFoundError);
        }
      });
    });
  });
});
