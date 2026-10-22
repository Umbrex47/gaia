import type { Product, SimulatorState, BlogArticle, FaqItem, User } from '../types';

const API_BASE = '/api';

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
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  }

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  }

  // --- SIMULATOR ---
  async getSimulatorState(): Promise<SimulatorState> {
    const res = await fetch(`${API_BASE}/simulator/state`);
    if (!res.ok) throw new Error('Error al conectar con el simulador');
    return res.json();
  }

  async updateSimulator(partial: Partial<SimulatorState>): Promise<SimulatorState> {
    const res = await fetch(`${API_BASE}/simulator/update`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(partial),
    });
    if (!res.ok) throw new Error('Error al actualizar simulación');
    return res.json();
  }

  async applySimulatorPreset(preset: string): Promise<SimulatorState> {
    const res = await fetch(`${API_BASE}/simulator/preset/${preset}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Error al aplicar preset climático');
    return res.json();
  }

  async toggleSimulatorHardware(key: string): Promise<SimulatorState> {
    const res = await fetch(`${API_BASE}/simulator/hardware/toggle/${key}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Error al alternar hardware');
    return res.json();
  }

  // --- ORDERS & CHECKOUT ---
  async checkout(orderData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error procesando el pedido' }));
      throw new Error(err.message || 'Error en la pasarela de pagos');
    }
    return res.json();
  }

  async createPayPalOrder(orderData: any): Promise<{ id: string; status: string; links: any[] }> {
    const res = await fetch(`${API_BASE}/orders/paypal/create-order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error creando orden de PayPal' }));
      throw new Error(err.message || 'Error al conectar con PayPal');
    }
    return res.json();
  }

  async capturePayPalOrder(orderId: string, customer: any, items: any[]): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/paypal/capture-order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ orderId, customer, items }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error capturando pago en PayPal' }));
      throw new Error(err.message || 'Error al procesar pago en PayPal');
    }
    return res.json();
  }

  // --- CHATBOT ---
  async sendChatMessage(message: string, history: any[] = []): Promise<any> {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Error al consultar al agente de IA');
    return res.json();
  }

  // --- BLOG ---
  async getArticles(tag?: string): Promise<BlogArticle[]> {
    const params = new URLSearchParams();
    if (tag) params.append('tag', tag);
    const res = await fetch(`${API_BASE}/blog?${params.toString()}`);
    if (!res.ok) throw new Error('Error al cargar artículos del blog');
    return res.json();
  }

  async getArticle(slug: string): Promise<BlogArticle> {
    const res = await fetch(`${API_BASE}/blog/${slug}`);
    if (!res.ok) throw new Error('Artículo no encontrado');
    return res.json();
  }

  // --- CONTACT & FAQS ---
  async sendContact(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error enviando mensaje' }));
      throw new Error(err.message || 'Error al enviar mensaje');
    }
    return res.json();
  }

  async getFaqs(category?: string): Promise<FaqItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/contact/faqs?${params.toString()}`);
    if (!res.ok) throw new Error('Error al cargar FAQs');
    return res.json();
  }

  // --- AUTH ---
  async login(credentials: any): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Credenciales inválidas' }));
      throw new Error(err.message || 'Error en inicio de sesión');
    }
    return res.json();
  }

  async register(data: any): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error en el registro' }));
      throw new Error(err.message || 'Error en el registro');
    }
    return res.json();
  }
}

export const api = new ApiService();
