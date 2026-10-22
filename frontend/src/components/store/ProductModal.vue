<script setup lang="ts">
import { ref } from 'vue';
import { 
  X, ShoppingCart, Star, 
  ShieldCheck, Check, Sparkles, ArrowRight 
} from 'lucide-vue-next';
import { useProductsStore } from '../../stores/products';
import { useCartStore } from '../../stores/cart';

const productsStore = useProductsStore();
const cartStore = useCartStore();

const quantity = ref(1);
const addedToCartSuccess = ref(false);

function handleAddToCart() {
  if (productsStore.selectedProduct) {
    cartStore.addItem(productsStore.selectedProduct, quantity.value);
    addedToCartSuccess.value = true;
    setTimeout(() => {
      addedToCartSuccess.value = false;
    }, 2500);
  }
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="productsStore.isProductModalOpen && productsStore.selectedProduct" 
      class="modal-backdrop"
      @click.self="productsStore.closeProductModal()"
    >
      <div class="modal-dialog product-dialog">
        <button 
          class="modal-close-btn" 
          @click="productsStore.closeProductModal()"
          aria-label="Cerrar ficha de producto"
        >
          <X :size="20" />
        </button>

        <div class="product-modal-grid">
          <!-- Left: Product Photo & Badges -->
          <div class="product-modal-media">
            <img 
              :src="productsStore.selectedProduct.image" 
              :alt="productsStore.selectedProduct.name" 
              class="product-modal-img" 
            />
            <div class="product-modal-badges">
              <span class="stock-badge">
                <Check :size="13" /> Stock Disponible ({{ productsStore.selectedProduct.stock }} unid.)
              </span>
            </div>
          </div>

          <!-- Right: Details, Specs, Actions -->
          <div class="product-modal-info">
            <span class="category-tag">{{ productsStore.selectedProduct.category.toUpperCase() }}</span>
            <h2 class="product-title">{{ productsStore.selectedProduct.name }}</h2>

            <div class="rating-row">
              <div class="stars-wrap">
                <Star v-for="i in 5" :key="i" :size="14" class="star-icon" />
              </div>
              <span class="rating-num">{{ productsStore.selectedProduct.rating }}</span>
              <span class="reviews-count">({{ productsStore.selectedProduct.reviewsCount }} opiniones de fincas)</span>
            </div>

            <div class="price-row">
              <span class="current-price">${{ productsStore.selectedProduct.price.toFixed(2) }} USD</span>
              <span v-if="productsStore.selectedProduct.comparePrice" class="compare-price">
                ${{ productsStore.selectedProduct.comparePrice.toFixed(2) }} USD
              </span>
            </div>

            <p class="product-desc">{{ productsStore.selectedProduct.description }}</p>

            <!-- Specs Table -->
            <div class="specs-card">
              <h4 class="specs-title">Especificaciones Técnicas Industriales</h4>
              <div class="specs-grid">
                <div 
                  v-for="(val, key) in productsStore.selectedProduct.specs" 
                  :key="key" 
                  class="spec-item"
                >
                  <span class="spec-label">{{ key }}</span>
                  <span class="spec-value">{{ val }}</span>
                </div>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="product-actions-wrap">
              <div class="qty-selector">
                <button class="qty-btn" @click="quantity = Math.max(1, quantity - 1)">-</button>
                <span class="qty-num">{{ quantity }}</span>
                <button class="qty-btn" @click="quantity++">+</button>
              </div>

              <button class="btn btn-primary btn-add-cart" @click="handleAddToCart">
                <ShoppingCart :size="18" />
                <span>{{ addedToCartSuccess ? '¡Agregado al Carrito!' : 'Añadir al Carrito' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(1, 29, 28, 0.85);
  backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.product-dialog {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  width: 920px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2.25rem;
  box-shadow: none;
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-silver-mist);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
}

.product-modal-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2.25rem;
}

@media (max-width: 768px) {
  .product-modal-grid {
    grid-template-columns: 1fr;
  }
}

.product-modal-media {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-modal-img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  border-radius: var(--radius-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.product-modal-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
  background: var(--color-liquid-kelp);
  padding: 6px 10px;
  border-radius: var(--radius-button);
}

.sim-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-platinum);
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 10px;
  border-radius: var(--radius-button);
}

.category-tag {
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
}

.product-title {
  font-family: var(--font-matter);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-platinum);
  margin: 0.3rem 0 0.6rem 0;
  line-height: 1.25;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-matter);
  font-size: 13px;
  margin-bottom: 1rem;
}

.stars-wrap {
  display: flex;
  color: var(--color-liquid-mist);
}

.rating-num {
  font-weight: 500;
  color: var(--color-platinum);
}

.reviews-count {
  color: var(--color-silver-mist);
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 1.25rem;
}

.current-price {
  font-family: var(--font-matter);
  font-size: 28px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}

.compare-price {
  font-family: var(--font-matter);
  font-size: 16px;
  color: var(--color-silver-mist);
  text-decoration: line-through;
}

.product-desc {
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-silver-mist);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

/* Specs Table */
.specs-card {
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.specs-title {
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: var(--color-platinum);
}

.specs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-matter);
  font-size: 12px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
  padding-bottom: 0.35rem;
}

.spec-label {
  color: var(--color-silver-mist);
}

.spec-value {
  color: var(--color-platinum);
  font-weight: 500;
  text-align: right;
}

/* Actions */
.product-actions-wrap {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.qty-selector {
  display: flex;
  align-items: center;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
}

.qty-btn {
  background: none;
  border: none;
  color: var(--color-silver-mist);
  font-size: 16px;
  width: 36px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.qty-btn:hover {
  color: var(--color-platinum);
}

.qty-num {
  padding: 0 0.8rem;
  font-family: var(--font-matter);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-platinum);
}

.btn-add-cart {
  flex: 1;
  padding: 10px 18px;
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

.btn-test-sim {
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-platinum);
  font-family: var(--font-matter);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all var(--transition-fast);
}

.btn-test-sim:hover {
  background: var(--color-liquid-mist);
  color: #012624;
}
</style>
