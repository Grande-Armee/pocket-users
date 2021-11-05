import { TestingModule } from '@nestjs/testing';

import { MongoHelper } from '../../../../integration-tests/helpers/mongo/mongo.helper';
import { TestModuleHelper } from '../../../../integration-tests/helpers/test-module/test-module.helper';
import { bcryptFactory } from '../../providers/bcrypt/bcrypt.factory';
import { Bcrypt } from '../../providers/bcrypt/interfaces/bcrypt.interface';
import { UserRepository } from '../../repositories/user/user.repository';
import { UserTestFactory } from '../../tests-factories/user.factory';
import { UserService } from './user.service';

describe('UserService', () => {
  let testingModule: TestingModule;
  let mongoHelper: MongoHelper;
  let bcrypt: Bcrypt;

  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    mongoHelper = new MongoHelper(testingModule);
    bcrypt = await bcryptFactory();

    userService = testingModule.get(UserService);
    userRepository = testingModule.get(UserRepository);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create user', () => {
    it('creates a user in the database', async () => {
      await mongoHelper.runInTestTransaction(async (session) => {
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        const userDTO = await userService.createUser({
          email,
          password,
          language,
        });

        expect(userDTO.email).toBe(email);
        expect(await bcrypt.compare(password, userDTO.password)).toBeTruthy();
        expect(userDTO.language).toBe(language);

        const user = await userRepository.findByUserId(session, userDTO.id);

        expect(user).not.toBe(null);
        expect(await bcrypt.compare(password, user!.password)).toBeTruthy();
        expect(user?.email).toBe(email);
      });
    });

    it('should not create new user when user with given email already exists', async () => {
      await mongoHelper.runInTestTransaction(async (session) => {
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        await userRepository.createUser(session, {
          email,
          password,
          language,
        });

        try {
          await userService.createUser({
            email,
            password,
            language,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }

        const users = await userRepository.findAll(session);
        expect(users.length).toBe(1);
      });
    });
  });

  describe('Log in user', () => {
    it('should not log in user when user with email not found', async () => {
      await mongoHelper.runInTestTransaction(async (session) => {
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();

        try {
          await userService.loginUser({
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
      await mongoHelper.runInTestTransaction(async (session) => {
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const invalidPassword = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        await userRepository.createUser(session, {
          email,
          password,
          language,
        });

        try {
          await userService.loginUser({
            email,
            password: invalidPassword,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    it('log in user and return access token', async () => {
      await mongoHelper.runInTestTransaction(async (session) => {
        const email = UserTestFactory.createEmail();
        const password = UserTestFactory.createPassword();
        const language = UserTestFactory.createLanguage();

        await userRepository.createUser(session, {
          email,
          password,
          language,
        });

        const token = await userService.loginUser({
          email,
          password,
        });

        expect(token).toBeTruthy();
      });
    });
  });
});
