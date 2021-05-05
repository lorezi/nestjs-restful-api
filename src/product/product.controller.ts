import { UpdateProductDto } from './models/updateProductDto';
import { AuthGuard } from './../auth/auth.guard';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './models/createProductDto';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.productService.paginate(page);
  }

  @Post()
  async create(@Body() body: CreateProductDto) {
    return await this.productService.create(body);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.productService.findOne({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    await this.productService.update(id, body);
    return this.productService.findOne({ id });
  }

  @Delete(':id')
  async delete(@Param(':id') id: string) {
    if (await this.productService.findOne({ id })) {
      await this.productService.delete(id);
      return {
        message: 'success',
      };
    }

    throw new HttpException(
      `product with the id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
