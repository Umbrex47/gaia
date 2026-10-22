import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SEED_PRODUCTS, SEED_ARTICLES, SEED_FAQS, Product, BlogArticle, FaqItem } from './seed.data';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  farmName?: string;
  hectares?: number;
  cropType?: string;
  role: 'farmer' | 'admin' | 'technician';
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'mercadopago' | 'stripe' | 'wire_transfer';
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentDetails: {
    lastFour?: string;
    transactionId: string;
    cardBrand?: string;
  };
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  farmSize?: string;
  cropType?: string;
  message: string;
  createdAt: Date;
}

@Injectable()
export class DataStoreService implements OnModuleInit {
  private readonly logger = new Logger(DataStoreService.name);

  private products: Product[] = [...SEED_PRODUCTS];
  private articles: BlogArticle[] = [...SEED_ARTICLES];
  private faqs: FaqItem[] = [...SEED_FAQS];
  private users: User[] = [];
  private orders: Order[] = [];
  private contactMessages: ContactMessage[] = [];

  async onModuleInit() {
    this.logger.log('Inicializando almacén de datos GaIA...');
    
    // Create demo administrator and demo farmer
    const adminPasswordHash = await bcrypt.hash('AdminGaIA2026!', 10);
    const farmerPasswordHash = await bcrypt.hash('Agricultor2026!', 10);

    this.users.push({
      id: 'usr-admin-01',
      name: 'Alejandro GaIA Admin',
      email: 'admin@gaia-agritech.com',
      passwordHash: adminPasswordHash,
      farmName: 'Centro de Innovación GaIA Hub',
      hectares: 250,
      cropType: 'Policultivo Demostrativo',
      role: 'admin',
      createdAt: new Date()
    });

    this.users.push({
      id: 'usr-farmer-01',
      name: 'Juan David Agricultor',
      email: 'juan@fincaesperanza.com',
      passwordHash: farmerPasswordHash,
      farmName: 'Finca La Esperanza',
      hectares: 35,
      cropType: 'Aguacate Hass & Cítricos',
      role: 'farmer',
      createdAt: new Date()
    });

    this.logger.log(`DataStore listo: ${this.products.length} productos, ${this.articles.length} artículos, ${this.users.length} usuarios precargados.`);
  }

  // --- PRODUCTS ---
  getProducts(search?: string, category?: string): Product[] {
    let result = [...this.products];

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id || p.slug === id);
  }

  // --- ARTICLES ---
  getArticles(tag?: string): BlogArticle[] {
    if (tag && tag.trim()) {
      const t = tag.toLowerCase().trim();
      return this.articles.filter(a => a.tags.some(tagItem => tagItem.toLowerCase() === t));
    }
    return this.articles;
  }

  getArticleBySlug(slug: string): BlogArticle | undefined {
    return this.articles.find(a => a.slug === slug || a.id === slug);
  }

  // --- FAQS ---
  getFaqs(category?: string): FaqItem[] {
    if (category && category !== 'all') {
      return this.faqs.filter(f => f.category === category);
    }
    return this.faqs;
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  // --- ORDERS & PAYMENTS ---
  createOrder(order: Order): Order {
    this.orders.unshift(order);
    return order;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  getOrdersByUser(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  // --- CONTACT MESSAGES ---
  saveContactMessage(message: ContactMessage): ContactMessage {
    this.contactMessages.unshift(message);
    return message;
  }
}
