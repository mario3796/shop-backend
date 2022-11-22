import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../users/users.model';
import { ProductDocument } from 'src/products/products.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Product') private productModel: Model<ProductDocument>,
  ) {}

  async addItem(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    const itemIndex = user.cart.items.findIndex(
      (item) => item.id === productId,
    );
    if (itemIndex < 0) {
      user.cart.items.push({
        id: productId,
        quantity: 1,
      });
    } else {
      const quantity = user.cart.items[itemIndex].quantity + 1;
      user.cart.items[itemIndex] = {
        id: productId,
        quantity,
      };
    }
    return await user.save();
  }

  async removeItem(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    const itemIndex = user.cart.items.findIndex(
      (item) => item.id === productId,
    );
    const quantity = user.cart.items[itemIndex].quantity - 1;
    if (quantity === 0) {
      user.cart.items = user.cart.items.filter((item) => item.id !== productId);
    } else {
      user.cart.items[itemIndex] = {
        id: productId,
        quantity,
      };
    }
    return await user.save();
  }

  async getCart(userId: string) {
    const user = await this.userModel.findById(userId);
    const items = [...user.cart.items];
    const products = await this.productModel.find();
    let totalPrice = 0;
    const cartItems = items
      .filter((item) => products.find(({ id }) => item.id === id))
      .map((item) => {
        const product = products.find(({ id }) => item.id === id);
        totalPrice += product.price * item.quantity;
        return {
          ...product.toObject(),
          quantity: item.quantity,
        };
      });
    return {
      cart: cartItems,
      totalPrice: totalPrice.toFixed(2),
    };
  }

  async clearCart(userId: string) {
    const user = await this.userModel.findById(userId);
    user.cart.items = [];
    return await user.save();
  }
}
