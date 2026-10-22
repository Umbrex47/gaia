import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '../types';
import { api } from '../services/api';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const categories = ref<Array<{ id: string; name: string; icon: string }>>([
    { id: 'all', name: 'Todos', icon: 'Grid' },
    { id: 'sensors', name: 'Sensores de Suelo', icon: 'Cpu' },
    { id: 'valves', name: 'Válvulas y Riego', icon: 'Droplets' },
    { id: 'drones', name: 'Drones y Robótica', icon: 'Plane' },
    { id: 'controllers', name: 'Cerebros Edge GaIA', icon: 'Radio' },
    { id: 'accessories', name: 'Fertirriego', icon: 'Sliders' },
  ]);
  const activeCategory = ref<string>('all');
  const searchQuery = ref<string>('');
  const selectedProduct = ref<Product | null>(null);
  const isProductModalOpen = ref(false);
  const isLoading = ref(false);

  async function fetchProducts() {
    isLoading.value = true;
    try {
      const data = await api.getProducts(searchQuery.value, activeCategory.value);
      products.value = data;
    } catch (e) {
      console.error('Error cargando productos', e);
    } finally {
      isLoading.value = false;
    }
  }

  function setCategory(categoryId: string) {
    activeCategory.value = categoryId;
    fetchProducts();
  }

  function setSearch(query: string) {
    searchQuery.value = query;
    fetchProducts();
  }

  function openProductModal(product: Product) {
    selectedProduct.value = product;
    isProductModalOpen.value = true;
  }

  function closeProductModal() {
    isProductModalOpen.value = false;
    selectedProduct.value = null;
  }

  const filteredProducts = computed(() => {
    return products.value;
  });

  return {
    products,
    categories,
    activeCategory,
    searchQuery,
    selectedProduct,
    isProductModalOpen,
    isLoading,
    filteredProducts,
    fetchProducts,
    setCategory,
    setSearch,
    openProductModal,
    closeProductModal,
  };
});
