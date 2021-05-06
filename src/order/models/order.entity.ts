import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  first_name: string;

  @Column()
  @Exclude()
  last_name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];

  @Expose()
  get name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Expose()
  get total(): number {
    return this.order_items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }
}
