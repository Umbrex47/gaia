import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem, Product } from '../types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isCartDrawerOpen = ref(false);
  const isCheckoutModalOpen = ref(false);

  // Restore cart from localStorage
  const savedCart = localStorage.getItem('gaia_cart');
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart);
    } catch {
      items.value = [];
    }
  }

  function saveCart() {
    localStorage.setItem('gaia_cart', JSON.stringify(items.value));
  }

  const totalItemsCount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  });

  const shipping = computed(() => {
    if (subtotal.value === 0) return 0;
    return subtotal.value >= 500 ? 0 : 25;
  });

  const tax = computed(() => {
    return Math.round(subtotal.value * 0.19 * 100) / 100;
  });

  const total = computed(() => {
    return Math.round((subtotal.value + shipping.value + tax.value) * 100) / 100;
  });

  function addItem(product: Product, quantity: number = 1) {
    const existing = items.value.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
    saveCart();
    isCartDrawerOpen.value = true;
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const item = items.value.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      saveCart();
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId);
    saveCart();
  }

  function clearCart() {
    items.value = [];
    saveCart();
  }

  function openCart() {
    isCartDrawerOpen.value = true;
  }

  function closeCart() {
    isCartDrawerOpen.value = false;
  }

  function openCheckout() {
    isCartDrawerOpen.value = false;
    isCheckoutModalOpen.value = true;
  }

  function closeCheckout() {
    isCheckoutModalOpen.value = false;
  }

  return {
    items,
    isCartDrawerOpen,
    isCheckoutModalOpen,
    totalItemsCount,
    subtotal,
    shipping,
    tax,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    openCheckout,
    closeCheckout,
  };
});
