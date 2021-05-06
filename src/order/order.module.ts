import { CommonModule } from './../common/common.module';
import { OrderItem } from './models/order-item.entity';
import { Order } from './models/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CommonModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
