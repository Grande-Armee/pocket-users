import { TestingModule } from '@nestjs/testing';

import { UserRepository } from '../../app/user/repositories/user.repository';
import { UserService } from '../../app/user/services/user.service';
import { MongoHelper } from '../helpers/mongo/mongo.helper';
import { TestModuleHelper } from '../helpers/test-module/test-module.helper';

describe('UserService', () => {
  // setup
  let testingModule: TestingModule;
  let mongoHelper: MongoHelper;

  // to test
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    mongoHelper = new MongoHelper(testingModule);

    userService = testingModule.get(UserService);
    userRepository = testingModule.get(UserRepository);
  });

  afterEach(() => {
    testingModule.close();
  });

  it('creates a user in the database', async () => {
    const session = await mongoHelper.startSessionAndMockConnection();

    const user = await userService.createUser();

    expect(user.password).toBe('test');
    expect(user.role).toBe('USER');

    const userInDb = await userRepository.readByUserId(session, user.id);

    expect(userInDb).toBeTruthy();

    await mongoHelper.rollbackAndTerminateSession();
  });
});
