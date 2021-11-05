import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ClientSession } from '../../../mongo/providers/unit-of-work-factory';
import { UserDTO } from '../../dtos/user.dto';
import { UserMapper } from '../../mappers/user/user.mapper';
import { UserEntity, UserModel, USER_MODEL } from '../../schemas/user.schema';

@Injectable()
export class UserRepository {
  public constructor(
    @InjectModel(USER_MODEL) private readonly userModel: UserModel,
    private readonly userMapper: UserMapper,
  ) {}

  public async findByUserId(session: ClientSession, userId: string): Promise<UserDTO | null> {
    const entity = await this.userModel
      .findOne(
        {
          _id: new ObjectId(userId),
        },
        null,
        { session },
      )
      .lean();

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async findByEmail(session: ClientSession, email: string): Promise<UserDTO | null> {
    const entity = await this.userModel
      .findOne(
        {
          email: email,
        },
        null,
        { session },
      )
      .lean();

    if (!entity) {
      return null;
    }

    return this.userMapper.mapEntityToDTO(entity);
  }

  public async findAll(session: ClientSession): Promise<UserDTO[]> {
    const users = await this.userModel.find({}, null, { session }).lean();

    return users.map((user) => this.userMapper.mapEntityToDTO(user));
  }

  public async createUser(session: ClientSession, userData: Partial<UserEntity>): Promise<UserDTO> {
    const entity = new this.userModel({ ...userData });

    await entity.save({ session });

    return this.userMapper.mapEntityToDTO(entity);
  }
}
