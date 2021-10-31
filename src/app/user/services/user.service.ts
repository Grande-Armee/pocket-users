import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '../../mongo/providers/unit-of-work';
import { UserDTO } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly userRepository: UserRepository,
  ) {}

  public async createUser(): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      return this.userRepository.createTestUser(session);
    });

    return user;
  }
}
