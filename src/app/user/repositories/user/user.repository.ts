import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { RepositoryFactory } from '../../../shared/mongo/interfaces';
import { ClientSession } from '../../../shared/unit-of-work/providers/unit-of-work-factory';
import { UserDTO } from '../../dtos/user.dto';
import { UserMapper } from '../../mappers/user/user.mapper';
import { UserEntity, UserModel, USER_MODEL } from '../../schemas/user.schema';

@Injectable()
export class UserRepository {
  public constructor(
    private readonly session: ClientSession,
    private readonly userModel: UserModel,
    private readonly userMapper: UserMapper,
  ) {}

  public async findOneById(userId: string): Promise<UserDTO | null> {
    const entity = await this.userModel
      .findOne(
        {
          _id: new ObjectId(userId),
        },
        null,
        { session: this.session },
      )
      .lean();

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async findOneByEmail(email: string): Promise<UserDTO | null> {
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

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async findAll(): Promise<UserDTO[]> {
    const users = await this.userModel.find({}, null, { session: this.session }).lean();

    return users.map((user) => this.userMapper.mapEntityToDTO(user));
  }

  public async createOne(userData: Partial<UserEntity>): Promise<UserDTO> {
    const entity = new this.userModel({ ...userData });

    await entity.save({ session: this.session });

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async removeOne(userId: string): Promise<void> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userModel.deleteOne(
      {
        _id: new ObjectId(userId),
      },
      { session: this.session },
    );
  }

  public async updateOne(userId: string, userData: Partial<UserEntity>): Promise<UserDTO> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userModel.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        ...userData,
      },
      { session: this.session },
    );

    return this.findOneById(userId) as Promise<UserDTO>;
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
