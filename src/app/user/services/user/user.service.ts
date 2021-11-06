import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '../../../mongo/providers/unit-of-work-factory';
import { UserDTO } from '../../dtos/user.dto';
import { UserRepository } from '../../repositories/user/user.repository';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { CreateUserData } from './interfaces/create-user-data.interface';
import { LoginUserData } from './interfaces/login-user-data.interface';
import { ResetPasswordData } from './interfaces/reset-password-data.interface';
import { UpdateUserData } from './interfaces/update-user-data.interface';

@Injectable()
export class UserService {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}

  public async loginUser(loginData: LoginUserData): Promise<string> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { email, password } = loginData;

    const user = await unitOfWork.runInTransaction(async (session) => {
      return this.userRepository.findByEmail(session, email);
    });

    if (!user) {
      throw new Error('invalid email or password');
    }

    const passwordValid = await this.hashService.comparePasswords(password, user.password);

    if (!passwordValid) {
      throw new Error('invalid email or password');
    }

    const accessToken = await this.tokenService.signAccessToken({ id: user.id, role: user.role });

    return accessToken;
  }

  public async resetPassowrd(resetPassowrdData: ResetPasswordData): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { userId, newPassword } = resetPassowrdData;

    const user = await unitOfWork.runInTransaction(async (session) => {
      return this.userRepository.updateUser(session, userId, {
        password: await this.hashService.hashPassword(newPassword),
      });
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async createUser(userData: CreateUserData): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      const { email, password } = userData;

      const existingUser = await this.userRepository.findByEmail(session, email);
      if (existingUser) {
        throw new Error(`User with email ${email} already exists`);
      }

      return this.userRepository.createUser(session, {
        email,
        password: await this.hashService.hashPassword(password),
      });
    });

    return user;
  }

  public async findUser(userId: string): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      return this.userRepository.findUserById(session, userId);
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async updateUser(userId: string, userData: UpdateUserData): Promise<UserDTO> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const user = await unitOfWork.runInTransaction(async (session) => {
      const { language } = userData;

      return this.userRepository.updateUser(session, userId, { language });
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async removeUser(userId: string): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async (session) => {
      return this.userRepository.removeUser(session, userId);
    });
  }
}
