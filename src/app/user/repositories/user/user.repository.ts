import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ClientSession } from '../../../mongo/providers/unit-of-work-factory';
import { UserDTO } from '../../dtos/user.dto';
import { UserMapper } from '../../mappers/user/user.mapper';
import { UserEntity, UserModel, USER_MODEL_TOKEN } from '../../schemas/user.schema';

@Injectable()
export class UserRepository {
  public constructor(
    @InjectModel(USER_MODEL_TOKEN) private readonly userModel: UserModel,
    private readonly userMapper: UserMapper,
  ) {}

  public async findUserById(session: ClientSession, userId: string): Promise<UserDTO | null> {
    const entity = await this.userModel.findOne(
      {
        _id: new ObjectId(userId),
      },
      null,
      { session },
    );

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async createUser(session: ClientSession, userData: Partial<UserEntity>): Promise<UserDTO> {
    const entity = new this.userModel({ ...userData });

    await entity.save({ session });

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async removeUser(session: ClientSession, userId: string): Promise<void> {
    const user = await this.findUserById(session, userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userModel.deleteOne(
      {
        _id: new ObjectId(userId),
      },
      { session },
    );
  }

  public async updateUser(
    session: ClientSession,
    userId: string,
    userData: Partial<UserEntity>,
  ): Promise<UserDTO | null> {
    const user = await this.findUserById(session, userId);

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
      { session },
    );

    return this.findUserById(session, userId);
  }
}
