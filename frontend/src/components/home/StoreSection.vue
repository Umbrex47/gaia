<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Search, ShoppingCart, ArrowUpRight 
} from 'lucide-vue-next';
import { useProductsStore } from '../../stores/products';
import { useCartStore } from '../../stores/cart';
import type { Product } from '../../types';

const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();

onMounted(() => {
  productsStore.fetchProducts();
});

function handleQuickAdd(product: Product, event: Event) {
  event.stopPropagation();
  cartStore.addItem(product, 1);
}
</script>

<template>
  <section id="tienda" class="section store-section">
    <div class="container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">
          CATÁLOGO DE INSTRUMENTACIÓN
        </span>
        <h2 class="section-title">Hardware Abierto Certificado GaIA</h2>
        <p class="section-subtitle">
          Dispositivos industriales seleccionados para operar en redes LoRaWAN de largo alcance y resistir intemperie severa.
        </p>
      </div>

      <!-- Filters & Search Toolbar (Recessed well in #011d1c) -->
      <div class="recessed-card store-toolbar">
        <!-- Categories Pills (6px radius, uppercase tracked) -->
        <div class="category-pills-wrap">
          <button 
            v-for="cat in productsStore.categories" 
            :key="cat.id" 
            class="cat-pill"
            :class="{ active: productsStore.activeCategory === cat.id }"
            @click="productsStore.setCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- In-Store Search Bar -->
        <div class="store-search-wrap">
          <Search :size="14" class="search-ico" />
          <input 
            v-model="productsStore.searchQuery" 
            type="text" 
            placeholder="BUSCAR EQUIPOS..." 
            class="store-search-input"
            @input="productsStore.fetchProducts()"
          />
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="productsStore.products.length === 0" class="empty-store-state">
        <p>No se encontraron productos con el criterio de búsqueda especificado.</p>
        <button class="btn btn-secondary mt-3" @click="productsStore.setSearch(''); productsStore.setCategory('all');">
          Restablecer Filtros
        </button>
      </div>

      <div v-else class="store-products-grid">
        <div 
          v-for="product in productsStore.products" 
          :key="product.id" 
          class="card product-card"
          :class="`theme-${product.category}`"
          @click="productsStore.openProductModal(product)"
        >
          <!-- Top Badges Overlay -->
          <div class="card-badges-top">
            <span class="stock-badge-pill">STOCK: {{ product.stock }}</span>
          </div>

          <!-- Product Image Box -->
          <div class="imgBox">
            <img :src="product.image" :alt="product.name" class="mouse" />
          </div>

          <!-- Content Box -->
          <div class="contentBox">
            <span class="category-indicator">{{ product.category.toUpperCase() }}</span>
            <h3>{{ product.name }}</h3>
            <h2 class="price">
              ${{ Math.floor(product.price) }}.<small>{{ (product.price % 1).toFixed(2).substring(2) }}</small> <span class="currency">USD</span>
            </h2>
            <div class="card-action-row">
              <a 
                href="#buy" 
                class="buy" 
                @click.prevent.stop="handleQuickAdd(product, $event)"
              >
                Comprar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.store-section {
  position: relative;
  background-color: var(--color-liquid-abyss);
}

.store-toolbar {
  padding: var(--spacing-20);
  margin-bottom: var(--spacing-36);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-20);
  flex-wrap: wrap;
}

.category-pills-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cat-pill {
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-silver-mist);
  font-size: 11px;
  font-family: var(--font-matter);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: var(--radius-buttons);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cat-pill:hover, .cat-pill.active {
  background: var(--surface-card-hover);
  color: var(--color-platinum);
  border-color: rgba(203, 255, 252, 0.3);
}

.store-search-wrap {
  position: relative;
  width: 240px;
}

@media (max-width: 639px) {
  .store-search-wrap {
    width: 100%;
  }
}

.search-ico {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-silver-mist);
}

.store-search-input {
  width: 100%;
  padding: 8px 12px 8px 2.2rem;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-buttons);
  color: var(--color-platinum);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.store-search-input:focus {
  outline: none;
  border-color: var(--color-liquid-mist);
}

.empty-store-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--color-silver-mist);
}

/* Products Grid */
.store-products-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.card {
  --card-gradient: linear-gradient(135deg, #00827c 0%, #00e599 55%, #70ffe5 100%);
  --card-btn-bg: linear-gradient(135deg, #00e599 0%, #70ffe5 100%);
  --card-btn-text: #012624;
  --card-btn-shadow: rgba(0, 229, 153, 0.45);
  --card-accent-border: rgba(0, 229, 153, 0.4);
  --card-watermark: rgba(203, 255, 252, 0.06);

  position: relative;
  width: 320px;
  height: 480px;
  background: #021a18;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

/* Category Accent Glows */
.card.theme-sensors {
  --card-gradient: linear-gradient(135deg, #006b64 0%, #00dfa2 55%, #64ffda 100%);
  --card-btn-bg: linear-gradient(135deg, #00dfa2 0%, #64ffda 100%);
  --card-btn-shadow: rgba(0, 223, 162, 0.45);
  --card-accent-border: rgba(0, 223, 162, 0.4);
}

.card.theme-valves {
  --card-gradient: linear-gradient(135deg, #005f73 0%, #06b6d4 55%, #67e8f9 100%);
  --card-btn-bg: linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%);
  --card-btn-shadow: rgba(6, 182, 212, 0.45);
  --card-accent-border: rgba(6, 182, 212, 0.4);
}

.card.theme-drones {
  --card-gradient: linear-gradient(135deg, #0369a1 0%, #38bdf8 55%, #bae6fd 100%);
  --card-btn-bg: linear-gradient(135deg, #38bdf8 0%, #bae6fd 100%);
  --card-btn-shadow: rgba(56, 189, 248, 0.45);
  --card-accent-border: rgba(56, 189, 248, 0.4);
}

.card.theme-controllers {
  --card-gradient: linear-gradient(135deg, #007c77 0%, #2dd4bf 55%, #a7f3d0 100%);
  --card-btn-bg: linear-gradient(135deg, #2dd4bf 0%, #a7f3d0 100%);
  --card-btn-shadow: rgba(45, 212, 191, 0.45);
  --card-accent-border: rgba(45, 212, 191, 0.4);
}

.card.theme-accessories {
  --card-gradient: linear-gradient(135deg, #047857 0%, #34d399 55%, #a7f3d0 100%);
  --card-btn-bg: linear-gradient(135deg, #34d399 0%, #a7f3d0 100%);
  --card-btn-shadow: rgba(52, 211, 153, 0.45);
  --card-accent-border: rgba(52, 211, 153, 0.4);
}

.card:hover {
  transform: translateY(-6px);
  border-color: var(--card-accent-border);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 24px var(--card-btn-shadow);
}

.card::before {
  content: "";
  position: absolute;
  top: -50%;
  width: 100%;
  height: 100%;
  background: var(--card-gradient);
  transform: skewY(345deg);
  transition: 0.5s ease;
  z-index: 0;
}

.card:hover::before {
  top: -70%;
  transform: skewY(390deg);
}

.card::after {
  content: "GAIA";
  position: absolute;
  bottom: -4px;
  left: 8px;
  font-weight: 700;
  font-size: 5.6em;
  color: var(--card-watermark);
  font-family: "Istok Web", sans-serif;
  pointer-events: none;
  line-height: 0.85;
  letter-spacing: -2px;
  z-index: 1;
}

.card-badges-top {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
}

.sim-badge-pill {
  font-family: "Istok Web", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #012624;
  background: rgba(255, 255, 255, 0.92);
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stock-badge-pill {
  font-family: "Istok Web", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: rgba(1, 29, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.card .imgBox {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  height: 250px;
  z-index: 2;
}

.mouse {
  height: 200px;
  max-width: 84%;
  width: auto;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.6);
  transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover .mouse {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.7);
}

.card .contentBox {
  position: relative;
  padding: 16px 20px 20px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 3;
  height: 215px;
}

.category-indicator {
  font-family: "Istok Web", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(203, 255, 252, 0.7);
  margin-bottom: 4px;
}

.card .contentBox h3 {
  font-family: "Istok Web", sans-serif;
  font-size: 17px;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 6px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.card .contentBox .price {
  font-family: "Istok Web", sans-serif;
  font-size: 25px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.card .contentBox .price small {
  font-size: 16px;
  font-weight: 700;
  opacity: 0.85;
}

.card .contentBox .price .currency {
  font-size: 13px;
  font-weight: 500;
  color: rgba(203, 255, 252, 0.8);
  margin-left: 4px;
}

.card-action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.card .contentBox .buy {
  position: relative;
  top: 100px;
  opacity: 0;
  padding: 10px 28px;
  color: var(--card-btn-text);
  text-decoration: none;
  background: var(--card-btn-bg);
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Istok Web", sans-serif;
  font-size: 12px;
  font-weight: 700;
  transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border: none;
  display: inline-block;
  box-shadow: 0 4px 15px var(--card-btn-shadow);
}

.card .contentBox .buy:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.sim-btn {
  position: relative;
  top: 100px;
  opacity: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.sim-btn:hover {
  background: var(--card-btn-bg);
  color: var(--card-btn-text);
  border-color: transparent;
  transform: scale(1.1);
}

.card:hover .contentBox .buy,
.card:hover .contentBox .sim-btn {
  top: 0;
  opacity: 1;
}
</style>
