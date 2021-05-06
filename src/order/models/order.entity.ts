import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];
}
