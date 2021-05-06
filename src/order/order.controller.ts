import { OrderItem } from './models/order-item.entity';
import { Order } from './models/order.entity';
import { Response } from 'express';
import { AuthGuard } from './../auth/auth.guard';
import { OrderService } from './order.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { Parser } from 'json2csv';

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async all(@Query('page') page = 1): Promise<PaginatedResult> {
    return this.orderService.paginate(page, ['order_items']);
  }

  @Post('export')
  async export(@Res() res: Response) {
    const parser = new Parser({
      fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
    });

    const orders = await this.orderService.all(['order_items']);

    let json = [];

    orders.forEach((order: Order) => {
      json = [
        {
          ID: order.id,
          Name: order.name,
          Email: order.email,
          'Product Title': '',
          Price: '',
          Quantity: '',
        },
        ...json,
      ];

      order.order_items.forEach((order_item: OrderItem) => {
        json = [
          {
            ID: '',
            Name: '',
            Email: '',
            'Product Title': order_item.product_title,
            Price: order_item.price,
            Quantity: order_item.quantity,
          },
          ...json,
        ];
      });
    });

    const csv = parser.parse(json);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    // TODO add return keyword to simulate the bug
    res.status(200).send(csv);
  }

  @Get('report')
  async report() {
    return this.orderService.report();
  }
}
