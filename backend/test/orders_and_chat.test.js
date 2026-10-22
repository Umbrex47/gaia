const test = require('node:test');
const assert = require('node:assert');
const { OrdersService } = require('../dist/orders/orders.service');
const { ChatService } = require('../dist/chat/chat.service');
const { DataStoreService } = require('../dist/database/data-store.service');

test('OrdersService - Checkout with valid Luhn card', async (t) => {
  const dataStore = new DataStoreService();
  await dataStore.onModuleInit();
  const ordersService = new OrdersService(dataStore);

  const order = ordersService.createOrder({
    customer: {
      fullName: 'Carlos Gómez',
      email: 'carlos@agro.com',
      phone: '+573001234567',
      address: 'Km 5 Vía Guarne',
      city: 'Rionegro',
      country: 'Colombia'
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Sensor de Suelo GaIA SoilSense Pro',
        price: 149.00,
        quantity: 2,
        image: 'https://example.com/soil.jpg'
      }
    ],
    paymentMethod: 'card',
    paymentCardInfo: {
      cardNumber: '4242 4242 4242 4242',
      cardHolder: 'CARLOS GOMEZ',
      expiryDate: '12/28',
      cvv: '888'
    }
  });

  assert.ok(order.orderNumber.startsWith('GAIA-'));
  assert.strictEqual(order.subtotal, 298.00);
  assert.strictEqual(order.paymentStatus, 'paid');
  assert.strictEqual(order.paymentDetails.cardBrand, 'Visa');
  assert.strictEqual(order.paymentDetails.lastFour, '4242');
});

test('ChatService - Reasoning process and hardware recommendation', async (t) => {
  const dataStore = new DataStoreService();
  await dataStore.onModuleInit();
  const chatService = new ChatService(dataStore);

  const reply = await chatService.processMessage('¿Cómo puedo calcular el riego para mi cultivo y ahorrar agua?');
  assert.strictEqual(reply.sender, 'assistant');
  assert.ok(reply.thinking && reply.thinking.length > 0);
  assert.ok(reply.recommendedHardwareIds.includes('prod-001'));
  assert.ok(reply.content.includes('GaIA SoilSense Pro'));
});
