import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  NotAcceptableException,
  UseGuards,
  HttpException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

import { Product } from './products.model';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { fileFilter, filename, deleteFile } from '../utils/file-manager.utils';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  async getProducts(@Query('page') page) {
    const { products, totalItems } = await this.productsService.findProducts(
      +page || 1,
    );
    return {
      products,
      totalItems,
      message: 'products fetched!',
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.findProduct(id);
    return {
      product,
      message: 'product fetched!',
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: 'uploads/images',
        filename: filename,
      }),
    }),
  )
  @HttpCode(201)
  async addProduct(
    @Body() productDoc: Product,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.productsService.validateInput(productDoc);
      if (!file)
        throw new NotAcceptableException('please pick a file of type image!');
      console.log(file);
      const product = await this.productsService.addProduct(
        productDoc,
        file.path,
      );
      return {
        product,
        message: 'product added!',
      };
    } catch (err) {
      if (file) deleteFile(file.path);
      throw new HttpException(err, 403, {
        cause: new Error(err),
      });
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return {
      message: 'product deleted!',
    };
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: 'uploads/images',
        filename: filename,
      }),
    }),
  )
  async updateProduct(
    @Param('id') prodId: string,
    @Body() productDoc: Product,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.productsService.validateInput(productDoc);
      if (!file)
        throw new NotAcceptableException('please pick a file of type image!');
      console.log(file);
      const product = await this.productsService.updateProduct(
        prodId,
        productDoc,
        file.path,
      );
      return {
        product,
        message: 'product updated!',
      };
    } catch (err) {
      if (file) deleteFile(file.path);
      throw new HttpException(err, 403, {
        cause: new Error(err),
      });
    }
  }
}
