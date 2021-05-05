import { ProductService } from './product.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.productService.paginate(page);
  }
}
