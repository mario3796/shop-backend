import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as schema } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({
    type: schema.Types.ObjectId,
    ref: 'User',
  })
  userId;

  @Prop()
  price: number;

  @Prop()
  products: [];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
