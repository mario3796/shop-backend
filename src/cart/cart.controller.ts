import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @HttpCode(200)
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    const { cart, totalPrice } = await this.cartService.getCart(userId);
    return {
      message: 'Cart fetched',
      cart,
      totalPrice,
    };
  }

  @HttpCode(200)
  @Delete(':userId')
  async clearCart(@Param('userId') userId: string) {
    const user = await this.cartService.clearCart(userId);
    return {
      message: 'Cart cleared',
      user,
    };
  }

  @HttpCode(201)
  @Post()
  async addProduct(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    const user = await this.cartService.addItem(userId, productId);
    return {
      message: 'Product added',
      user,
    };
  }

  @HttpCode(200)
  @Put()
  async removeProduct(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    const user = await this.cartService.removeItem(userId, productId);
    return {
      message: 'Product removed',
      user,
    };
  }
}
