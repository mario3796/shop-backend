import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.model';
import { User } from '../users/users.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getOrders(userId: string) {
    const orders = await this.orderModel.find({ userId }).populate('userId');
    return orders;
  }

  async getOrder(id: string) {
    const order = await this.orderModel.findById(id).populate('userId');
    return order;
  }

  async addOrder(order: Order) {
    const newOrder = new this.orderModel({
      ...order,
    });
    await newOrder.save();
    const user = await this.userModel.findById(order.userId);
    user.cart.items = [];
    await user.save();
    return newOrder;
  }
}
