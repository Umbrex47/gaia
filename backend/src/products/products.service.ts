import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../database/data-store.service';
import { Product } from '../database/seed.data';

@Injectable()
export class ProductsService {
  constructor(private readonly dataStore: DataStoreService) {}

  findAll(search?: string, category?: string): Product[] {
    return this.dataStore.getProducts(search, category);
  }

  findOne(id: string): Product {
    const product = this.dataStore.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Producto '${id}' no encontrado`);
    }
    return product;
  }

  getCategories() {
    return [
      { id: 'all', name: 'Todos los Productos', icon: 'Grid' },
      { id: 'sensors', name: 'Sensores de Suelo e IoT', icon: 'Cpu' },
      { id: 'valves', name: 'Válvulas y Riego', icon: 'Droplets' },
      { id: 'drones', name: 'Drones y Robótica Aérea', icon: 'Plane' },
      { id: 'controllers', name: 'Cerebros y Hubs Edge', icon: 'Radio' },
      { id: 'accessories', name: 'Fertirriego y Accesorios', icon: 'Sliders' },
    ];
  }
}
