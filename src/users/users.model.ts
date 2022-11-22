import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
  })
  email;

  @Prop({
    type: String,
    required: true,
  })
  username;

  @Prop({
    type: String,
    required: true,
  })
  password;

  @Prop({
    type: {
      items: [
        {
          id: { type: String },
          quantity: { type: Number },
          _id: false,
        },
      ],
    },
    _id: false,
  })
  cart: {
    items: {
      id: string;
      quantity: number;
    }[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
