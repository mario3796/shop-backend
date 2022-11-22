import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Order } from './orders.model';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @HttpCode(200)
  async getOrders(@Query('userId') userId: string) {
    const orders = await this.ordersService.getOrders(userId);
    return {
      message: 'Orders fetched',
      orders,
    };
  }

  @HttpCode(200)
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.ordersService.getOrder(id);
    return {
      message: 'Order fetched',
      order,
    };
  }

  @HttpCode(201)
  @Post()
  async addOrder(@Body() orderDoc: Order) {
    const order = await this.ordersService.addOrder(orderDoc);
    return {
      message: 'Order added',
      order,
    };
  }
}
