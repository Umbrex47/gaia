import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PayPalService } from './paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';

export class PayPalCaptureRequestDto {
  orderId!: string;
  customer?: any;
  items?: any[];
}

@Controller('api/orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly payPalService: PayPalService,
  ) {}

  @Post('checkout')
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  // --- PAYPAL CHECKOUT ENDPOINTS ---
  @Post('paypal/create-order')
  async createPayPalOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.payPalService.createOrder(createOrderDto);
  }

  @Post('paypal/capture-order')
  async capturePayPalOrder(@Body() dto: PayPalCaptureRequestDto) {
    return this.payPalService.captureOrder(dto.orderId, dto.customer, dto.items || []);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
