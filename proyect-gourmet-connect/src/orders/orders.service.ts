import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/products/entities/product.entity/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.details || createOrderDto.details.length === 0) {
      throw new BadRequestException(
        'El pedido debe contener al menos un producto',
      );
    }

    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      status: OrderStatus.PENDIENTE,
      total: 0,
    });

    await this.orderRepository.save(order);

    let total = 0;
    const details: OrderDetail[] = [];

    for (const detailDto of createOrderDto.details) {
      const product = await this.productRepository.findOne({
        where: { id: detailDto.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${detailDto.productId} no encontrado`,
        );
      }

      if (!product.isAvailable) {
        throw new BadRequestException(
          `El producto "${product.name}" no está disponible`,
        );
      }

      if (product.stock < detailDto.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto "${product.name}"`,
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = detailDto.quantity * unitPrice;

      const detail = this.orderDetailRepository.create({
        order,
        product,
        quantity: detailDto.quantity,
        unitPrice,
        subtotal,
      });

      total += subtotal;
      details.push(detail);
    }

    await this.orderDetailRepository.save(details);

    order.total = total;
    await this.orderRepository.save(order);

    return this.findOne(order.id);
  }

  async findAll() {
    return this.orderRepository.find({
      relations: {
        details: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        details: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  async updateStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    order.status = updateOrderStatusDto.status;

    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    await this.orderRepository.remove(order);

    return {
      message: `Pedido ${id} eliminado correctamente`,
    };
  }
}