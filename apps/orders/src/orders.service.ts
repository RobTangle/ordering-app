import { Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({});
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    // create order
    return this.ordersRepository.create(request);
  }
}
