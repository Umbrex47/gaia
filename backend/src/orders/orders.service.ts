import { Injectable, BadRequestException } from '@nestjs/common';
import { DataStoreService, Order } from '../database/data-store.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResendEmailService } from '../contact/resend-email.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataStore: DataStoreService,
    private readonly resendEmailService: ResendEmailService,
  ) {}

  private validateLuhn(cardNumber: string): boolean {
    const sanitized = cardNumber.replace(/\D/g, '');
    if (sanitized.length < 13 || sanitized.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  createOrder(dto: CreateOrderDto, userId?: string): Order {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El carrito no contiene productos.');
    }

    if (!dto.customer.fullName || !dto.customer.email || !dto.customer.address) {
      throw new BadRequestException('Información de entrega incompleta.');
    }

    let lastFour = '4242';
    let cardBrand = 'Visa';

    if (dto.paymentMethod === 'card') {
      const card = dto.paymentCardInfo;
      if (!card || !card.cardNumber || !card.cvv || !card.expiryDate) {
        throw new BadRequestException('Por favor ingresa los datos completos de tu tarjeta.');
      }
      const rawNum = card.cardNumber.replace(/\s+/g, '');
      if (!this.validateLuhn(rawNum)) {
        throw new BadRequestException('El número de tarjeta no es válido (verificación Luhn fallida).');
      }
      lastFour = rawNum.slice(-4);
      if (rawNum.startsWith('4')) cardBrand = 'Visa';
      else if (rawNum.startsWith('5')) cardBrand = 'Mastercard';
      else if (rawNum.startsWith('3')) cardBrand = 'American Express';
    }

    const subtotal = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = Math.round(subtotal * 0.19 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const orderNumber = `GAIA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId,
      customer: dto.customer,
      items: dto.items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: dto.paymentMethod,
      paymentStatus: 'paid',
      paymentDetails: {
        lastFour,
        cardBrand,
        transactionId: `TXN-GAIA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
      createdAt: new Date(),
    };

    const savedOrder = this.dataStore.createOrder(newOrder);

    // Enviar notificación automática por correo (Resend)
    this.resendEmailService.sendOrderNotification(savedOrder).catch(() => {});

    return savedOrder;
  }

  getOrder(id: string): Order | undefined {
    return this.dataStore.getOrderById(id);
  }

  getUserOrders(userId: string): Order[] {
    return this.dataStore.getOrdersByUser(userId);
  }
}
