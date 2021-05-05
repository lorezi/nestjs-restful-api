import { UpdateProductDto } from './models/updateProductDto';
import { AuthGuard } from './../auth/auth.guard';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Get,
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
    return this.productService.create({ body });
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
}
