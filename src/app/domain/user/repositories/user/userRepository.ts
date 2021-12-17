import { UserNotFoundError } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RepositoryFactory } from '@shared/mongo/types';
import { ClientSession } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserDto } from '../../dtos/userDto';
import { User, UserModel, USER_MODEL } from '../../entities/user';
import { UserMapper } from '../../mappers/user/userMapper';

@Injectable()
export class UserRepository {
  public constructor(
    private readonly session: ClientSession,
    private readonly userModel: UserModel,
    private readonly userMapper: UserMapper,
  ) {}

  public async findOneById(userId: string): Promise<UserDto | null> {
    const entity = await this.userModel
      .findOne(
        {
          _id: userId,
        },
        null,
        { session: this.session },
      )
      .lean();

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDto(entity);
  }

  public async findOneByEmail(email: string): Promise<UserDto | null> {
    const entity = await this.userModel
      .findOne(
        {
          email: email,
        },
        null,
        { session: this.session },
      )
      .lean();

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDto(entity);
  }

  public async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find({}, null, { session: this.session }).lean();

    return users.map((user) => this.userMapper.mapEntityToDto(user));
  }

  public async createOne(userData: Partial<User>): Promise<UserDto> {
    const entity = new this.userModel({ ...userData });

    await entity.save({ session: this.session });

    return this.userMapper.mapEntityToDto(entity);
  }

  public async removeOne(userId: string): Promise<void> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new UserNotFoundError({ id: userId });
    }

    await this.userModel.deleteOne(
      {
        _id: userId,
      },
      { session: this.session },
    );
  }

  public async updateOne(userId: string, userData: Partial<Omit<User, '_id'>>): Promise<UserDto> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new UserNotFoundError({ id: userId });
    }

    await this.userModel.updateOne(
      {
        _id: userId,
      },
      { ...userData },
      { session: this.session },
    );

    return this.findOneById(userId) as Promise<UserDto>;
  }
}

@Injectable()
export class UserRepositoryFactory implements RepositoryFactory<UserRepository> {
  public constructor(
    @InjectModel(USER_MODEL) private readonly userModel: UserModel,
    private readonly userMapper: UserMapper,
  ) {}

  public create(session: ClientSession): UserRepository {
    return new UserRepository(session, this.userModel, this.userMapper);
  }
}
