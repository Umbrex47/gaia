const test = require('node:test');
const assert = require('node:assert');
const { PayPalService } = require('../dist/orders/paypal.service');
const { DataStoreService } = require('../dist/database/data-store.service');

test('PayPalService - Fetch OAuth2 access token from PayPal Sandbox', async (t) => {
  const dataStore = new DataStoreService();
  await dataStore.onModuleInit();

  const mockConfig = {
    get: (key) => {
      if (key === 'PAYPAL_CLIENT_ID') return 'AR7d_f5QrWaKk4yVU0imQjI9oBuUzVaF0djtCrupR0dy_JBAlgRJg23kiuLoA4_TAtqWilcxjrhp8FlT';
      if (key === 'PAYPAL_CLIENT_SECRET') return 'EN6jrB1DxNF8QjExHKr8avCHeXoc4VK7boi5su8hM9KINbp_WUq083PKpHyrbBSNJHO-y_FLWL9IZeEo';
      if (key === 'PAYPAL_API_URL') return 'https://api-m.sandbox.paypal.com';
      return null;
    }
  };

  const paypalService = new PayPalService(mockConfig, dataStore);
  const token = await paypalService.getAccessToken();
  assert.ok(token);
  assert.strictEqual(typeof token, 'string');
});

test('PayPalService - Create Sandbox Order with items and breakdown', async (t) => {
  const dataStore = new DataStoreService();
  await dataStore.onModuleInit();

  const mockConfig = {
    get: (key) => {
      if (key === 'PAYPAL_CLIENT_ID') return 'AR7d_f5QrWaKk4yVU0imQjI9oBuUzVaF0djtCrupR0dy_JBAlgRJg23kiuLoA4_TAtqWilcxjrhp8FlT';
      if (key === 'PAYPAL_CLIENT_SECRET') return 'EN6jrB1DxNF8QjExHKr8avCHeXoc4VK7boi5su8hM9KINbp_WUq083PKpHyrbBSNJHO-y_FLWL9IZeEo';
      if (key === 'PAYPAL_API_URL') return 'https://api-m.sandbox.paypal.com';
      return null;
    }
  };

  const paypalService = new PayPalService(mockConfig, dataStore);
  const order = await paypalService.createOrder({
    customer: {
      fullName: 'Carlos Gómez',
      email: 'carlos@agro.com',
      phone: '+573000000000',
      address: 'Finca Los Pinos',
      city: 'Medellín',
      country: 'Colombia'
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Sensor de Suelo GaIA SoilSense Pro',
        price: 149.00,
        quantity: 1,
        image: 'https://example.com/sensor.jpg'
      }
    ],
    paymentMethod: 'card'
  });

  assert.ok(order.id);
  assert.strictEqual(order.status, 'CREATED');
  assert.ok(order.links && order.links.length > 0);
});
