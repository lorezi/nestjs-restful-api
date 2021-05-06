import { AuthGuard } from './../auth/auth.guard';
import { OrderService } from './order.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@UseGuards(AuthGuard)
@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('orders')
  async all(@Query('page') page = 1): Promise<PaginatedResult> {
    return this.orderService.paginate(page, ['order_items']);
  }
}
