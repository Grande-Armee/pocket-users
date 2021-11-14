import { TestingModule } from '@nestjs/testing';

import { MongoHelper } from '@integration/helpers/mongoHelper/mongoHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { UserDTO } from '../../dtos/userDTO';
import { UserRepositoryFactory } from '../../repositories/user/userRepository';
import { UserTestFactory } from '../../testsFactories/userTestFactory';
import { HashService } from '../hash/hashService';
import { TokenService } from '../token/tokenService';
import { UserService } from './userService';

describe('UserService', () => {
  let testingModule: TestingModule;
  let mongoHelper: MongoHelper;

  let userService: UserService;
  let userRepositoryFactory: UserRepositoryFactory;
  let tokenService: TokenService;
  let hashService: HashService;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    mongoHelper = new MongoHelper(testingModule);

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
      expect.assertions(6);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        const userDTO = await userService.createUser(unitOfWork, {
          email,
          password,
          language,
        });

        expect(userDTO.email).toBe(email);
        expect(await hashService.comparePasswords(password, userDTO.password)).toBeTruthy();
        expect(userDTO.language).toBe(language);

        const user = (await userRepository.findOneById(userDTO.id)) as UserDTO;

        expect(user).not.toBeNull();
        expect(await hashService.comparePasswords(password, user.password)).toBeTruthy();
        expect(user?.email).toBe(email);
      });
    });

    it('should not create new user when user with given email already exists', async () => {
      expect.assertions(2);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

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
          expect(error).toBeTruthy();
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
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();

        try {
          await userService.loginUser(unitOfWork, {
            email,
            password,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should not log in user when user password does not match', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const hashedPassword = await hashService.hashPassword(password);
        const invalidPassword = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

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
          expect(error).toBeTruthy();
        }
      });
    });

    it('log in user and return access token', async () => {
      expect.assertions(3);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const hashedPassword = await hashService.hashPassword(password);
        const language = UserTestFactory.createLanguage();

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
        const userId = UserTestFactory.createId();
        const newPassword = UserTestFactory.createPassword();

        try {
          await userService.setNewPassword(unitOfWork, userId, newPassword);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should change user password when user is found', async () => {
      expect.assertions(3);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const hashedPassword = await hashService.hashPassword(password);
        const newPassword = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        const user = await userRepository.createOne({
          email,
          password: hashedPassword,
          language,
        });

        const userDTO = await userService.setNewPassword(unitOfWork, user.id, newPassword);

        expect(await hashService.comparePasswords(newPassword, userDTO.password)).toBe(true);

        const userInDb = (await userRepository.findOneById(userDTO.id)) as UserDTO;

        expect(userInDb).not.toBeNull();
        expect(await hashService.comparePasswords(newPassword, userInDb.password)).toBe(true);
      });
    });
  });

  describe('Find user', () => {
    it('finds a user in the database', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();

        /* Create the user using a tested interface */
        const userDTO = await userRepository.createOne({
          email,
          password,
        });

        /* Find user using the interface under test */
        const user = await userService.findUser(unitOfWork, userDTO.id);

        expect(user).not.toBeNull();
      });
    });

    it('attempts to find a non-existent user', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const userId = UserTestFactory.createId();

        /* Try finding user using the interface under test */
        try {
          await userService.findUser(unitOfWork, userId);
        } catch (e: any) {
          expect(e.message).toBe('User not found');
        }
      });
    });
  });

  describe('Update user', () => {
    it('updates user data in the database', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const originalLanguage = 'en';
        const newLanguage = 'pl';

        /* Create the user using a tested interface */
        const userDTO = await userRepository.createOne({
          email,
          password,
          language: originalLanguage,
        });

        /* Update the user data using the interface under test */
        await userService.updateUser(unitOfWork, userDTO.id, {
          language: newLanguage,
        });

        /* Assert user data successfully updated */
        const user = await userRepository.findOneById(userDTO.id);

        expect(user?.language).toBe(newLanguage);
      });
    });

    it('tries updating non-existent user', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const userId = UserTestFactory.createId();
        const language = UserTestFactory.createLanguage();

        /* Try updating the user data using the interface under test */
        try {
          await userService.updateUser(unitOfWork, userId, { language });
        } catch (e: any) {
          expect(e.message).toBe('User not found');
        }
      });
    });
  });

  describe('Remove user', () => {
    it('removes a user from the databse', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const session = unitOfWork.getSession();
        const userRepository = userRepositoryFactory.create(session);

        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();

        /* Create the user using a tested interface */
        const userDTO = await userRepository.createOne({
          email,
          password,
        });

        /* Remove the user using the interface under test */
        await userService.removeUser(unitOfWork, userDTO.id);

        /* Assert user is no longer in the database */
        const user = await userRepository.findOneById(userDTO.id);

        expect(user).toBeNull();
      });
    });

    it('tries removing a user not in the databse', async () => {
      expect.assertions(1);

      await mongoHelper.runInTestTransaction(async (unitOfWork) => {
        const userId = UserTestFactory.createId();

        /* Try removing the user using the interface under test */
        try {
          await userService.removeUser(unitOfWork, userId);
        } catch (e: any) {
          expect(e.message).toBe('User not found');
        }
      });
    });
  });
});
