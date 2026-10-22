<script setup lang="ts">
import { 
  X, Trash2, Plus, Minus, ShoppingBag, 
  ArrowRight, ShieldCheck, Truck 
} from 'lucide-vue-next';
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <div>
    <!-- Overlay Backdrop -->
    <Transition name="fade">
      <div 
        v-if="cartStore.isCartDrawerOpen" 
        class="cart-backdrop" 
        @click="cartStore.closeCart()"
      ></div>
    </Transition>

    <!-- Slide Drawer -->
    <Transition name="slide-cart">
      <aside 
        v-if="cartStore.isCartDrawerOpen" 
        class="cart-drawer"
        aria-label="Carrito de compras"
      >
        <div class="cart-header">
          <div class="cart-header-title">
            <ShoppingBag :size="20" class="text-neon" />
            <h3>Tu Carrito Agrícola</h3>
            <span class="cart-count-badge">{{ cartStore.totalItemsCount }}</span>
          </div>
          <button 
            class="close-cart-btn" 
            @click="cartStore.closeCart()" 
            aria-label="Cerrar carrito"
          >
            <X :size="22" />
          </button>
        </div>

        <!-- Free shipping progress bar -->
        <div class="shipping-notice">
          <div class="shipping-notice-text">
            <Truck :size="15" />
            <span v-if="cartStore.subtotal >= 500">
              ¡Tienes <strong>Envío Nacional Gratis</strong> en tu pedido!
            </span>
            <span v-else>
              Agrega <strong>${{ (500 - cartStore.subtotal).toFixed(2) }} USD</strong> más para Envío Gratis
            </span>
          </div>
          <div class="shipping-progress-track">
            <div 
              class="shipping-progress-bar" 
              :style="{ width: `${Math.min(100, (cartStore.subtotal / 500) * 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Items List -->
        <div class="cart-body">
          <div v-if="cartStore.items.length === 0" class="empty-cart-state">
            <div class="empty-icon-circle">
              <ShoppingBag :size="40" class="text-muted" />
            </div>
            <h4>Tu carrito está vacío</h4>
            <p>Explora nuestros sensores, válvulas y drones con IA para automatizar tu campo.</p>
            <button class="btn btn-outline" @click="cartStore.closeCart()">
              Explorar Tienda GaIA
            </button>
          </div>

          <div v-else class="cart-items-list">
            <div 
              v-for="item in cartStore.items" 
              :key="item.product.id" 
              class="cart-item-row"
            >
              <img :src="item.product.image" :alt="item.product.name" class="cart-item-thumb" />
              <div class="cart-item-details">
                <h4 class="cart-item-name">{{ item.product.name }}</h4>
                <div class="cart-item-price-row">
                  <span class="cart-item-price">${{ item.product.price.toFixed(2) }} USD</span>
                  <span class="cart-item-subtotal">Total: ${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="cart-item-actions">
                  <div class="qty-control">
                    <button 
                      class="qty-btn" 
                      @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                      aria-label="Disminuir"
                    >
                      <Minus :size="14" />
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button 
                      class="qty-btn" 
                      @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                      aria-label="Aumentar"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>

                  <button 
                    class="remove-item-btn" 
                    @click="cartStore.removeItem(item.product.id)"
                    title="Eliminar producto"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout trigger -->
        <div v-if="cartStore.items.length > 0" class="cart-footer">
          <div class="summary-line">
            <span>Subtotal</span>
            <span>${{ cartStore.subtotal.toFixed(2) }} USD</span>
          </div>
          <div class="summary-line">
            <span>Envío Estimado</span>
            <span>{{ cartStore.shipping === 0 ? 'GRATIS' : `$${cartStore.shipping.toFixed(2)} USD` }}</span>
          </div>
          <div class="summary-line">
            <span>IVA Estimado (19%)</span>
            <span>${{ cartStore.tax.toFixed(2) }} USD</span>
          </div>
          <div class="summary-total-line">
            <span>Total a Pagar</span>
            <span class="total-amount">${{ cartStore.total.toFixed(2) }} USD</span>
          </div>

          <button class="btn btn-primary btn-checkout" @click="cartStore.openCheckout()">
            <span>Proceder al Pago Seguro</span>
            <ArrowRight :size="18" />
          </button>

          <div class="secure-checkout-badge">
            <ShieldCheck :size="15" class="text-neon" />
            <span>Transacciones cifradas de grado militar SSL 256-bit</span>
          </div>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(1, 29, 28, 0.82);
  backdrop-filter: blur(4px);
  z-index: 80;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 440px;
  max-width: 100vw;
  background: var(--color-liquid-deep);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 85;
  display: flex;
  flex-direction: column;
  box-shadow: none;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cart-header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.cart-header-title h3 {
  font-family: var(--font-matter);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-platinum);
  letter-spacing: -0.01em;
  margin: 0;
}

.cart-count-badge {
  background: var(--color-liquid-kelp);
  color: var(--color-liquid-mist);
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-button);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.close-cart-btn {
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-silver-mist);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-cart-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
}

.shipping-notice {
  background: var(--color-liquid-abyss);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.85rem 1.5rem;
}

.shipping-notice-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
  margin-bottom: 0.5rem;
}

.shipping-notice-text strong {
  color: var(--color-platinum);
}

.shipping-progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.shipping-progress-bar {
  height: 100%;
  background: var(--color-aurora-gradient);
  transition: width 0.3s ease;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
}

.empty-cart-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: var(--color-silver-mist);
}

.empty-cart-state h4 {
  font-family: var(--font-matter);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-platinum);
  margin-bottom: 0.5rem;
}

.empty-cart-state p {
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-silver-mist);
  margin-bottom: 1.5rem;
  max-width: 260px;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-item-row {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cart-item-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-button);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-name {
  font-family: var(--font-matter);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-platinum);
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.cart-item-price-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-matter);
  font-size: 13px;
  margin-bottom: 0.5rem;
}

.cart-item-price {
  color: var(--color-lavender-phosphor);
  font-weight: 500;
}

.cart-item-subtotal {
  color: var(--color-silver-mist);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
}

.qty-btn {
  background: none;
  border: none;
  color: var(--color-silver-mist);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.qty-btn:hover {
  color: var(--color-platinum);
}

.qty-value {
  padding: 0 0.5rem;
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-platinum);
}

.remove-item-btn {
  background: none;
  border: none;
  color: var(--color-silver-mist);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-button);
  transition: color var(--transition-fast);
}

.remove-item-btn:hover {
  color: #fca5a5;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--color-liquid-deep);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  margin-bottom: 0.4rem;
}

.summary-total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-matter);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-platinum);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
  margin-bottom: 1.25rem;
}

.total-amount {
  color: var(--color-lavender-phosphor);
  font-size: 20px;
  font-weight: 500;
}

.btn-checkout {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-button);
  background: var(--color-aurora-gradient);
  color: #012624;
  font-family: var(--font-matter);
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.secure-checkout-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  font-family: var(--font-matter);
  font-size: 11px;
  color: var(--color-silver-mist);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-cart-enter-active, .slide-cart-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-cart-enter-from, .slide-cart-leave-to {
  transform: translateX(100%);
}
</style>
