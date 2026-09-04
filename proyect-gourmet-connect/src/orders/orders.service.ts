import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private orderDetails: OrderDetail[] = [];

  private nextOrderId = 1;
  private nextOrderDetailId = 1;

  create(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.details || createOrderDto.details.length === 0) {
      throw new BadRequestException(
        'El pedido debe contener al menos un producto',
      );
    }

    const order = new Order();

    order.id = this.nextOrderId++;
    order.userId = createOrderDto.userId;
    order.status = OrderStatus.PENDIENTE;
    order.total = 0;
    order.createdAt = new Date();
    order.updatedAt = new Date();

    let total = 0;

    for (const detailDto of createOrderDto.details) {
      const detail = new OrderDetail();

      detail.id = this.nextOrderDetailId++;
      detail.orderId = order.id;
      detail.productId = detailDto.productId;
      detail.quantity = detailDto.quantity;
      detail.unitPrice = detailDto.unitPrice;
      detail.subtotal = detailDto.quantity * detailDto.unitPrice;

      total += detail.subtotal;

      this.orderDetails.push(detail);
    }

    order.total = total;

    this.orders.push(order);

    return {
      ...order,
      details: this.orderDetails.filter(
        (detail) => detail.orderId === order.id,
      ),
    };
  }

  findAll() {
    return this.orders.map((order) => ({
      ...order,
      details: this.orderDetails.filter(
        (detail) => detail.orderId === order.id,
      ),
    }));
  }

  findOne(id: number) {
    const order = this.orders.find((order) => order.id === id);

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return {
      ...order,
      details: this.orderDetails.filter(
        (detail) => detail.orderId === order.id,
      ),
    };
  }

  updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = this.orders.find((order) => order.id === id);

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    order.status = updateOrderStatusDto.status;
    order.updatedAt = new Date();

    return order;
  }

  remove(id: number) {
    const orderIndex = this.orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    this.orders.splice(orderIndex, 1);

    this.orderDetails = this.orderDetails.filter(
      (detail) => detail.orderId !== id,
    );

    return {
      message: `Pedido ${id} eliminado correctamente`,
    };
  }
}