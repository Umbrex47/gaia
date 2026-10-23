import type { Product, SimulatorState, BlogArticle, FaqItem, User } from '../types';
import { FALLBACK_PRODUCTS, FALLBACK_ARTICLES, FALLBACK_FAQS } from './seedData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('gaia_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // --- PRODUCTS ---
  async getProducts(search?: string, category?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      let filtered = [...FALLBACK_PRODUCTS];
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      const found = FALLBACK_PRODUCTS.find(p => p.id === id || p.slug === id);
      if (found) return found;
      throw new Error('Producto no encontrado');
    }
  }

  // --- SIMULATOR ---
  async getSimulatorState(): Promise<SimulatorState> {
    try {
      const res = await fetch(`${API_BASE}/simulator/state`);
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      return {
        soilMoisture: 42,
        temperature: 24,
        solarRadiation: 650,
        pestPressure: 4,
        cropStage: 'vegetative',
        weatherPreset: 'optimal',
        autonomyLevel: 'supervised',
        installedHardware: {
          sensor: true,
          valve: true,
          drone: false,
          meteo: true,
          hub: true,
        },
        actuators: {
          valveOpen: false,
          droneFlying: false,
          droneMission: 'idle',
          lastWaterLiters: 120,
        },
        cropHealthScore: 94,
        eventLogs: [
          {
            id: 'log-1',
            timestamp: new Date().toLocaleTimeString(),
            agent: 'HydroAgent',
            message: 'Balance hídrico óptimo en el surco 4',
            type: 'info',
          }
        ],
      };
    }
  }

  async updateSimulator(partial: Partial<SimulatorState>): Promise<SimulatorState> {
    try {
      const res = await fetch(`${API_BASE}/simulator/update`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(partial),
      });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      const current = await this.getSimulatorState();
      return { ...current, ...partial };
    }
  }

  async applySimulatorPreset(preset: string): Promise<SimulatorState> {
    try {
      const res = await fetch(`${API_BASE}/simulator/preset/${preset}`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      const current = await this.getSimulatorState();
      return current;
    }
  }

  async toggleSimulatorHardware(key: string): Promise<SimulatorState> {
    try {
      const res = await fetch(`${API_BASE}/simulator/hardware/toggle/${key}`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      const current = await this.getSimulatorState();
      return current;
    }
  }

  // --- ORDERS & CHECKOUT ---
  async checkout(orderData: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      // Offline fallback: create simulated approved order
      const subtotal = orderData.items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);
      const shipping = subtotal >= 500 ? 0 : 25;
      const tax = Math.round(subtotal * 0.19 * 100) / 100;
      const total = Math.round((subtotal + shipping + tax) * 100) / 100;
      const orderNumber = `GAIA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
      
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customer: orderData.customer,
        items: orderData.items,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: orderData.paymentMethod || 'card',
        paymentStatus: 'paid',
        paymentDetails: {
          lastFour: orderData.paymentCardInfo?.cardNumber ? orderData.paymentCardInfo.cardNumber.slice(-4) : '4242',
          cardBrand: 'Visa / Mastercard',
          transactionId: `TXN-GAIA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        },
        createdAt: new Date(),
      };

      const existingOrders = JSON.parse(localStorage.getItem('gaia_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('gaia_orders', JSON.stringify(existingOrders));

      return newOrder;
    }
  }

  async createPayPalOrder(orderData: any): Promise<{ id: string; status: string; links: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/orders/paypal/create-order`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      // In case backend is offline, return synthetic PayPal order ID
      return {
        id: `PP-GAIA-ORDER-${Date.now()}`,
        status: 'CREATED',
        links: []
      };
    }
  }

  async capturePayPalOrder(orderId: string, customer: any, items: any[]): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/paypal/capture-order`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ orderId, customer, items }),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      const subtotal = items.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);
      const shipping = subtotal >= 500 ? 0 : 25;
      const tax = Math.round(subtotal * 0.19 * 100) / 100;
      const total = Math.round((subtotal + shipping + tax) * 100) / 100;

      return {
        id: `ord-pp-${Date.now()}`,
        orderNumber: `GAIA-PP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
        customer,
        items,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        paymentDetails: {
          lastFour: 'PAYPAL',
          cardBrand: 'PayPal SSL',
          transactionId: orderId,
        },
        createdAt: new Date(),
      };
    }
  }

  // --- CHATBOT ---
  async sendChatMessage(message: string, history: any[] = []): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message, history }),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      const msg = message.toLowerCase();
      let response = 'Los agentes de IA de GaIA monitorean continuamente el balance hídrico, sanidad foliar y nutrición de tu cultivo. Te recomendamos revisar el sensor SoilSense Pro y la electroválvula HydroValve 24V para automatizar el riego con base en datos reales.';
      let recommendedProducts: any[] = [FALLBACK_PRODUCTS[0], FALLBACK_PRODUCTS[1]];

      if (msg.includes('dron') || msg.includes('plaga') || msg.includes('ndvi')) {
        response = 'Para la detección temprana de plagas y estrés fitosanitario, el dron autónomo AeroScout X4 realiza barridos multiespectrales calculando índices NDVI y RedEdge hasta 14 días antes de que los síntomas sean visibles.';
        recommendedProducts = [FALLBACK_PRODUCTS[2]];
      } else if (msg.includes('clima') || msg.includes('helada') || msg.includes('lluvia')) {
        response = 'La micro-estación MeteoStation 4G mide evapotranspiración, radiación solar y velocidad de viento para alimentar el algoritmo de riego preventivo de GaIA.';
        recommendedProducts = [FALLBACK_PRODUCTS[3]];
      }

      return {
        thinking: [
          'Analizando consulta del agricultor con base en agronomía de precisión...',
          'Consultando base de conocimientos de hardware y agentes GaIA...',
          'Formulando plan de automatización con estimación de retorno de inversión.'
        ],
        response,
        recommendedProducts
      };
    }
  }

  // --- BLOG ---
  async getArticles(tag?: string): Promise<BlogArticle[]> {
    try {
      const params = new URLSearchParams();
      if (tag) params.append('tag', tag);
      const res = await fetch(`${API_BASE}/blog?${params.toString()}`);
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      if (tag) {
        return FALLBACK_ARTICLES.filter(a => a.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
      }
      return FALLBACK_ARTICLES;
    }
  }

  async getArticle(slug: string): Promise<BlogArticle> {
    try {
      const res = await fetch(`${API_BASE}/blog/${slug}`);
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      const found = FALLBACK_ARTICLES.find(a => a.slug === slug || a.id === slug);
      if (found) return found;
      throw new Error('Artículo no encontrado');
    }
  }

  // --- CONTACT & FAQS ---
  async sendContact(data: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      return {
        success: true,
        message: 'Solicitud recibida exitosamente. Un especialista agronómico de GaIA se pondrá en contacto contigo.',
        id: `cnt-${Date.now()}`
      };
    }
  }

  async getFaqs(category?: string): Promise<FaqItem[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      const res = await fetch(`${API_BASE}/contact/faqs?${params.toString()}`);
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      if (category && category !== 'all') {
        return FALLBACK_FAQS.filter(f => f.category === category);
      }
      return FALLBACK_FAQS;
    }
  }

  // --- AUTH ---
  async login(credentials: any): Promise<{ access_token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      const dummyUser: User = {
        id: 'usr-demo-1',
        name: credentials.email ? credentials.email.split('@')[0].toUpperCase() : 'AGRICULTOR DEMO',
        email: credentials.email || 'demo@finca.com',
        farmName: 'Hacienda El Progreso',
        hectares: 25,
        cropType: 'Café & Aguacate',
        role: 'farmer',
      };
      const token = `gaia-jwt-demo-${Date.now()}`;
      localStorage.setItem('gaia_token', token);
      localStorage.setItem('gaia_user', JSON.stringify(dummyUser));
      return { access_token: token, user: dummyUser };
    }
  }

  async register(data: any): Promise<{ access_token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      throw new Error('API offline');
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name || 'Productor GaIA',
        email: data.email,
        farmName: data.farmName || 'Predio Agrícola',
        hectares: data.hectares || 10,
        cropType: data.cropType || 'Frutales',
        role: 'farmer',
      };
      const token = `gaia-jwt-demo-${Date.now()}`;
      localStorage.setItem('gaia_token', token);
      localStorage.setItem('gaia_user', JSON.stringify(newUser));
      return { access_token: token, user: newUser };
    }
  }
}

export const api = new ApiService();
