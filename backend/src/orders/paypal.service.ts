import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataStoreService, Order } from '../database/data-store.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResendEmailService } from '../contact/resend-email.service';

export class PayPalCaptureDto {
  orderId!: string;
  customer?: any;
  items?: any[];
}

@Injectable()
export class PayPalService {
  private readonly logger = new Logger(PayPalService.name);
  private clientId: string;
  private clientSecret: string;
  private apiUrl: string;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataStore: DataStoreService,
    private readonly resendEmailService: ResendEmailService,
  ) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || process.env.PAYPAL_CLIENT_SECRET || '';
    this.apiUrl = this.configService.get<string>('PAYPAL_API_URL') || 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.tokenExpiresAt > now + 60000) {
      return this.cachedToken;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await fetch(`${this.apiUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Error autenticando con PayPal: ${errText}`);
        throw new InternalServerErrorException('Error en autenticación con PayPal Sandbox');
      }

      const data = await response.json();
      this.cachedToken = data.access_token;
      this.tokenExpiresAt = now + (data.expires_in * 1000);
      return this.cachedToken;
    } catch (err: any) {
      this.logger.error(`Fallo de conexión a PayPal: ${err.message}`);
      throw new InternalServerErrorException(err.message || 'No se pudo conectar a PayPal Sandbox');
    }
  }

  async createOrder(dto: CreateOrderDto): Promise<{ id: string; status: string; links: any[] }> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }

    const token = await this.getAccessToken();

    const subtotal = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 500 ? 0 : 25;
    const tax = Math.round(subtotal * 0.19 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: `GAIA-REF-${Date.now()}`,
          description: 'GaIA AgroTech - Automatización Agrícola Inteligente',
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2),
              },
              shipping: {
                currency_code: 'USD',
                value: shipping.toFixed(2),
              },
              tax_total: {
                currency_code: 'USD',
                value: tax.toFixed(2),
              },
            },
          },
          items: dto.items.map(item => ({
            name: item.name.substring(0, 127),
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        brand_name: 'GaIA AgroTech',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: 'https://gaia-agritech.com/checkout/success',
        cancel_url: 'https://gaia-agritech.com/checkout/cancel',
      },
    };

    const response = await fetch(`${this.apiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let err: any = {};
      try {
        err = JSON.parse(errText);
      } catch {
        err = { message: errText };
      }
      this.logger.error(`Error creando orden en PayPal: ${JSON.stringify(err)}`);
      throw new BadRequestException(err.message || err.error_description || 'Error al iniciar pago en PayPal');
    }

    const orderData = await response.json();
    return {
      id: orderData.id,
      status: orderData.status,
      links: orderData.links,
    };
  }

  async captureOrder(orderId: string, customerData: any, items: any[] = []): Promise<Order> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.apiUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      let err: any = {};
      try {
        err = JSON.parse(errText);
      } catch {
        err = { message: errText };
      }
      this.logger.error(`Error capturando orden de PayPal: ${JSON.stringify(err)}`);
      throw new BadRequestException(err.message || 'Error al procesar el pago de PayPal');
    }

    const captureData = await response.json();
    this.logger.log(`Orden PayPal ${orderId} capturada exitosamente con status: ${captureData.status}`);

    const purchaseUnit = captureData.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const totalAmount = parseFloat(capture?.amount?.value || purchaseUnit?.amount?.value || '0');

    const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0) || totalAmount;
    const shipping = subtotal >= 500 ? 0 : 25;
    const tax = Math.round(subtotal * 0.19 * 100) / 100;

    const orderNumber = `GAIA-PP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const newOrder: Order = {
      id: `ord-pp-${Date.now()}`,
      orderNumber,
      customer: {
        fullName: customerData?.fullName || `${captureData.payer?.name?.given_name || 'Cliente'} ${captureData.payer?.name?.surname || 'PayPal'}`,
        email: customerData?.email || captureData.payer?.email_address || 'cliente@paypal.com',
        phone: customerData?.phone || '',
        address: customerData?.address || `${purchaseUnit?.shipping?.address?.address_line_1 || 'Dirección de envío PayPal'}`,
        city: customerData?.city || purchaseUnit?.shipping?.address?.admin_area_2 || 'Bogotá',
        country: customerData?.country || purchaseUnit?.shipping?.address?.country_code || 'Colombia',
      },
      items: items.length > 0 ? items : [
        {
          productId: 'prod-001',
          name: 'Kit de Hardware Agrícola GaIA',
          price: subtotal,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal,
      shipping,
      tax,
      total: totalAmount || (subtotal + shipping + tax),
      paymentMethod: 'card', // Registered as paid transaction
      paymentStatus: 'paid',
      paymentDetails: {
        lastFour: 'PAYPAL',
        cardBrand: 'PayPal Sandbox',
        transactionId: capture?.id || orderId,
      },
      createdAt: new Date(),
    };

    const savedOrder = this.dataStore.createOrder(newOrder);

    // Enviar notificación por correo usando Resend a la cuenta de la empresa
    this.resendEmailService.sendOrderNotification(savedOrder).catch(err => {
      this.logger.warn(`Error al enviar correo de orden Resend: ${err?.message}`);
    });

    return savedOrder;
  }
}
