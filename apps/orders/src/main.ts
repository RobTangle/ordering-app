import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  await app.listen(PORT);
  console.log(`*ORDERS* LISTENING ON PORT ${PORT}.`);
}
bootstrap();
