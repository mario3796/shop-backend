import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({
    type: String,
    required: true,
  })
  title;

  @Prop()
  description: string;

  @Prop({
    type: Number,
    required: true,
  })
  price;

  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
