import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { deleteFile } from 'src/utils/file-manager.utils';
import { Product, ProductDocument } from './products.model';

@Injectable()
export class ProductsService {
  ITEMS_PER_PAGE = 2;
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
  ) {}

  async validateInput(product: Product) {
    if (!product.title.trim())
      throw new NotAcceptableException('product title is required!');
    if (product.title.trim().length < 2)
      throw new NotAcceptableException('product title is not valid!');
    if (!+product.price.toString())
      throw new NotAcceptableException('product price is required!');
    if (product.price < 0.01)
      throw new NotAcceptableException('product price is not valid!');
  }

  async addProduct(product: Product, image?: string) {
    try {
      const newProduct = new this.productModel({
        image,
        ...product,
      });
      return await newProduct.save();
    } catch (err) {
      throw new HttpException(err, 400, {
        cause: new Error(err),
      });
    }
  }

  async findProducts(page: number) {
    const totalItems = await this.productModel.find().countDocuments();
    const products = await this.productModel
      .find()
      .skip((page - 1) * this.ITEMS_PER_PAGE)
      .limit(this.ITEMS_PER_PAGE);
    return {
      products,
      totalItems,
    };
  }

  async findProduct(productId: string) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Could not find a product!');
      }
      return product;
    } catch (err) {
      throw new HttpException(err, 400, {
        cause: new Error(err),
      });
    }
  }

  async updateProduct(productId: string, product: Product, image: string) {
    try {
      const updatedProduct = await this.productModel.findById(productId);
      if (!updatedProduct) {
        throw new NotFoundException('Could not find a product!');
      }
      updatedProduct.title = product.title;
      updatedProduct.description = product.description;
      updatedProduct.price = product.price;
      if (image) {
        updatedProduct.image && deleteFile(updatedProduct.image);
        updatedProduct.image = image;
      }
      return await updatedProduct.save();
    } catch (err) {
      throw new HttpException(err, 403, {
        cause: new Error(err),
      });
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Could not find a product!');
      }
      deleteFile(product.image);
      return await product.remove();
    } catch (err) {
      throw new HttpException(err, 400, {
        cause: new Error(err),
      });
    }
  }
}
