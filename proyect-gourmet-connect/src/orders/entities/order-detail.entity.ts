import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity/product.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.details, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column()
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitPrice!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal!: number;
}
