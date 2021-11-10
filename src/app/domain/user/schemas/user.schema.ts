import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserEntity {
  public _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  public email: string;

  @Prop({
    required: true,
  })
  public password: string;

  @Prop({
    default: false,
  })
  public isActive: boolean;

  @Prop({
    default: 'USER',
  })
  public role: string;

  @Prop({
    default: 'en',
  })
  public language: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

export type UserModel = Model<UserDocument>;

export const USER_MODEL = UserEntity.name;