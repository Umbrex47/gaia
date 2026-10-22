import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PayPalService } from './paypal.service';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [ContactModule],
  controllers: [OrdersController],
  providers: [OrdersService, PayPalService],
  exports: [OrdersService, PayPalService],
})
export class OrdersModule {}
