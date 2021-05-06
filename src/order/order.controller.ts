import { Order } from './models/order.entity';
import { AuthGuard } from './../auth/auth.guard';
import { OrderService } from './order.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('orders')
  async all(@Query('page') page = 1): Promise<PaginatedResult> {
    return this.orderService.paginate(page, ['order_items']);
    // return this.orderService.all(['order_items']);
  }
}
