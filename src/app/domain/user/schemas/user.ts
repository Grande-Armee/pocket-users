import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes } from 'mongoose';
import { v4 } from 'uuid';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    default: v4,
    type: SchemaTypes.String,
  })
  public _id: string;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.String,
  })
  public email: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  public password: string;

  @Prop({
    default: false,
    type: SchemaTypes.Boolean,
  })
  public isActive: boolean;

  @Prop({
    default: 'USER',
    type: SchemaTypes.String,
  })
  public role: string;

  @Prop({
    default: 'en',
    type: SchemaTypes.String,
  })
  public language: string;

  @Prop({
    type: SchemaTypes.Date,
  })
  public createdAt: Date;

  @Prop({
    type: SchemaTypes.Date,
  })
  public updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;

export type UserModel = Model<UserDocument>;

export const USER_MODEL = User.name;
