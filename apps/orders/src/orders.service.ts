import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { Order } from './schemas/order.schema';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({});
  }

  async createOrder(
    request: CreateOrderRequest,
    authentication: string,
  ): Promise<Order> {
    // create order
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });

      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      console.log(
        '🚀 ~ file: orders.service.ts:25 ~ OrdersService ~ createOrder ~ error',
        error,
      );

      await session.abortTransaction();
    }
    return this.ordersRepository.create(request);
  }
}
