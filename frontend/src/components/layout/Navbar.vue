<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Menu, Search, ShoppingCart, User as UserIcon, 
  Cpu, X, ChevronRight, ArrowUpRight, LogOut 
} from 'lucide-vue-next';
import { useCartStore } from '../../stores/cart';
import { useAuthStore } from '../../stores/auth';
import { useProductsStore } from '../../stores/products';
import HamburgerDrawer from './HamburgerDrawer.vue';
import type { Product } from '../../types';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const productsStore = useProductsStore();

const isMobileMenuOpen = ref(false);
const searchInput = ref('');
const isSearchDropdownOpen = ref(false);
const searchResults = ref<Product[]>([]);

function openMobileMenu() {
  isMobileMenuOpen.value = true;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

watch(searchInput, (val) => {
  if (val.trim().length >= 2) {
    const q = val.toLowerCase().trim();
    searchResults.value = productsStore.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 4);
    isSearchDropdownOpen.value = true;
  } else {
    searchResults.value = [];
    isSearchDropdownOpen.value = false;
  }
});

function handleSearchSubmit() {
  if (searchInput.value.trim()) {
    productsStore.setSearch(searchInput.value.trim());
    isSearchDropdownOpen.value = false;
    router.push('/tienda');
  }
}

function selectSearchResult(product: Product) {
  isSearchDropdownOpen.value = false;
  searchInput.value = '';
  productsStore.openProductModal(product);
}

function handleUserClick() {
  authStore.openAuthModal('login');
}
</script>

<template>
  <header class="navbar-wrapper">
    <div class="container navbar-container">
      <!-- Left: Mobile Menu & Brand -->
      <div class="navbar-left">
        <button 
          class="hamburger-btn hide-on-desktop" 
          @click="openMobileMenu" 
          aria-label="Abrir menú"
        >
          <Menu :size="22" />
        </button>

        <router-link to="/" class="brand-link">
          <img src="/logo-gaia.svg" alt="GaIA Logo" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-title">GaIA</span>
            <span class="brand-subtitle hide-on-mobile">ABYSSAL AGRO</span>
          </div>
        </router-link>
      </div>

      <!-- Center: Ghost Navigation Links (12px uppercase, 0.12em tracking) -->
      <nav class="navbar-nav hide-on-tablet hide-on-mobile" aria-label="Navegación principal">
        <router-link to="/" class="ghost-nav-link">Inicio</router-link>
        <router-link to="/tienda" class="ghost-nav-link">Tienda</router-link>
        <router-link to="/planes" class="ghost-nav-link">Planes</router-link>
        <router-link to="/nosotros" class="ghost-nav-link">Nosotros</router-link>
        <router-link to="/blog" class="ghost-nav-link">Blog</router-link>
        <router-link to="/contacto" class="ghost-nav-link">Contacto</router-link>
      </nav>

      <!-- Right: Search Bar + Cart + Primary Action -->
      <div class="navbar-right">
        <!-- Search Input with Auros styling -->
        <div class="search-box-wrap hide-on-mobile">
          <form class="search-form" @submit.prevent="handleSearchSubmit">
            <Search :size="14" class="search-icon" />
            <input 
              v-model="searchInput"
              type="text" 
              placeholder="BUSCAR HARDWARE..." 
              class="search-input"
              @focus="searchInput.trim().length >= 2 ? isSearchDropdownOpen = true : null"
            />
            <button 
              v-if="searchInput" 
              type="button" 
              class="search-clear-btn" 
              @click="searchInput = ''"
            >
              <X :size="12" />
            </button>
          </form>

          <!-- Search Dropdown Preview -->
          <div v-if="isSearchDropdownOpen && searchResults.length > 0" class="search-dropdown">
            <div class="dropdown-header">HARDWARE DETECTADO:</div>
            <div 
              v-for="prod in searchResults" 
              :key="prod.id" 
              class="dropdown-item"
              @click="selectSearchResult(prod)"
            >
              <img :src="prod.image" :alt="prod.name" class="dropdown-item-img" />
              <div class="dropdown-item-info">
                <p class="dropdown-item-title">{{ prod.name }}</p>
                <p class="dropdown-item-price">${{ prod.price.toFixed(2) }} USD</p>
              </div>
              <ArrowUpRight :size="14" class="dropdown-arrow" />
            </div>
          </div>
        </div>

        <!-- Cart Button (6px radius) -->
        <button 
          class="cart-btn" 
          @click="cartStore.openCart()" 
          aria-label="Abrir carrito"
        >
          <ShoppingCart :size="18" />
          <span v-if="cartStore.totalItemsCount > 0" class="cart-badge">
            {{ cartStore.totalItemsCount }}
          </span>
        </button>

        <!-- Auth Buttons: Iniciar Sesión & Registrarse -->
        <div v-if="!authStore.isAuthenticated" class="auth-actions-group">
          <button 
            type="button" 
            class="btn-nav-login hide-on-mobile" 
            @click="authStore.openAuthModal('login')"
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            class="btn btn-primary btn-nav-register" 
            @click="authStore.openAuthModal('register')"
          >
            <UserIcon :size="13" />
            <span>Registrarse</span>
          </button>
        </div>

        <!-- Authenticated User Profile Pill -->
        <div v-else class="user-profile-menu">
          <button 
            type="button"
            class="user-pill-btn"
            @click="authStore.openAuthModal('login')"
            title="Ver perfil de agricultor"
          >
            <span class="user-avatar-dot"></span>
            <span class="user-pill-name">{{ authStore.user?.name?.split(' ')[0] }}</span>
          </button>
          <button
            type="button"
            class="btn-logout-mini"
            @click="authStore.logout()"
            title="Cerrar sesión"
          >
            <LogOut :size="13" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu Component -->
    <HamburgerDrawer 
      :is-open="isMobileMenuOpen" 
      @close="closeMobileMenu" 
    />
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  height: var(--header-height);
  background: rgba(1, 38, 36, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 50;
  display: flex;
  align-items: center;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-24);
}

/* Left Brand */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hamburger-btn {
  background: transparent;
  border: none;
  color: var(--color-platinum);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 34px;
  height: 34px;
  filter: drop-shadow(0 0 8px rgba(0, 130, 124, 0.5));
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-matter);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-platinum);
  letter-spacing: -0.04em;
  line-height: 1;
}

.brand-subtitle {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--color-liquid-mist);
  margin-top: 3px;
  text-transform: uppercase;
}

/* Center Ghost Nav (12px, uppercase, 0.12em tracking, 16-24px gap) */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
}

.ghost-nav-link {
  font-family: var(--font-matter);
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-silver-mist);
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  position: relative;
  padding: 0;
  background: transparent;
  border: none;
}

.ghost-nav-link:hover, .ghost-nav-link.router-link-active {
  color: var(--color-platinum);
}

.sim-highlight-link {
  color: var(--color-liquid-mist);
}

.nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-aurora-gradient);
}

/* Right Section */
.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
}

.search-box-wrap {
  position: relative;
  width: 220px;
}

.search-form {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--color-silver-mist);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 1.5rem 8px 2.2rem;
  background: var(--color-liquid-deep);
  border: 1px solid var(--color-slate-deep);
  border-radius: var(--radius-small);
  color: var(--color-platinum);
  font-size: 11px;
  font-family: var(--font-matter);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-liquid-mist);
}

.search-clear-btn {
  position: absolute;
  right: 0.6rem;
  background: none;
  border: none;
  color: var(--color-silver-mist);
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Search Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-small);
  overflow: hidden;
  z-index: 60;
}

.dropdown-header {
  padding: 8px 12px;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 8px 12px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--surface-card-hover);
}

.dropdown-item-img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
}

.dropdown-item-info {
  flex: 1;
}

.dropdown-item-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-platinum);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.dropdown-item-price {
  font-size: 11px;
  color: var(--color-lavender-phosphor);
}

.dropdown-arrow {
  color: var(--color-silver-mist);
}

/* Action Buttons */
.cart-btn {
  position: relative;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-platinum);
  width: 38px;
  height: 38px;
  border-radius: var(--radius-buttons);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.cart-btn:hover {
  background: var(--surface-card-hover);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-lavender-phosphor);
  color: #222222;
  font-size: 10px;
  font-weight: 500;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-actions-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-nav-login {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--color-silver-mist);
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: var(--radius-buttons);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-nav-login:hover {
  color: var(--color-platinum);
  border-color: rgba(203, 255, 252, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.btn-nav-register {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: var(--radius-buttons);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 223, 162, 0.25);
  transition: all var(--transition-fast);
}

.btn-nav-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 223, 162, 0.4);
}

.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-buttons);
  padding: 4px 8px;
}

.user-pill-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--color-platinum);
  cursor: pointer;
  font-family: var(--font-matter);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 6px;
}

.user-avatar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00dfa2;
  box-shadow: 0 0 8px #00dfa2;
}

.user-pill-name {
  color: var(--color-platinum);
}

.btn-logout-mini {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: var(--color-silver-mist);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-logout-mini:hover {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.2);
}
</style>
