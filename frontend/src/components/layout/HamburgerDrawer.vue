<script setup lang="ts">
import { 
  X, Home, Cpu, ShoppingBag, CreditCard, Users, 
  BookOpen, HelpCircle, Mail, LogIn, User as UserIcon, LogOut, UserPlus 
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const authStore = useAuthStore();
const cartStore = useCartStore();

function handleLinkClick() {
  emit('close');
}

function handleLoginClick() {
  emit('close');
  authStore.openAuthModal('login');
}

function handleRegisterClick() {
  emit('close');
  authStore.openAuthModal('register');
}

function handleLogout() {
  emit('close');
  authStore.logout();
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="drawer-overlay" @click="emit('close')"></div>
  </Transition>

  <Transition name="slide">
    <aside v-if="isOpen" class="hamburger-drawer" aria-label="Menú móvil">
      <div class="drawer-header">
        <div class="drawer-brand">
          <img src="/logo-gaia.svg" alt="GaIA Logo" class="brand-logo" />
          <span class="brand-name">GaIA</span>
        </div>
        <button class="drawer-close-btn" @click="emit('close')" aria-label="Cerrar menú">
          <X :size="20" />
        </button>
      </div>

      <div class="drawer-body">
        <div v-if="authStore.isAuthenticated" class="user-badge-card">
          <div class="user-avatar">
            <UserIcon :size="16" />
          </div>
          <div class="user-info">
            <p class="user-name">{{ authStore.user?.name }}</p>
            <p class="user-farm">{{ authStore.user?.farmName }}</p>
          </div>
        </div>

        <nav class="drawer-nav">
          <router-link to="/" class="drawer-link" @click="handleLinkClick">
            <Home :size="16" class="nav-icon" />
            <span>Inicio</span>
          </router-link>

          <router-link to="/tienda" class="drawer-link" @click="handleLinkClick">
            <ShoppingBag :size="16" class="nav-icon" />
            <span>Tienda Hardware</span>
          </router-link>

          <router-link to="/planes" class="drawer-link" @click="handleLinkClick">
            <CreditCard :size="16" class="nav-icon" />
            <span>Planes & Suscripción</span>
          </router-link>

          <router-link to="/nosotros" class="drawer-link" @click="handleLinkClick">
            <Users :size="16" class="nav-icon" />
            <span>Sobre GaIA</span>
          </router-link>

          <router-link to="/blog" class="drawer-link" @click="handleLinkClick">
            <BookOpen :size="16" class="nav-icon" />
            <span>Blog & Logros</span>
          </router-link>

          <router-link to="/#faq" class="drawer-link" @click="handleLinkClick">
            <HelpCircle :size="16" class="nav-icon" />
            <span>Preguntas Frecuentes</span>
          </router-link>

          <router-link to="/contacto" class="drawer-link" @click="handleLinkClick">
            <Mail :size="16" class="nav-icon" />
            <span>Contacto</span>
          </router-link>
        </nav>
      </div>

      <div class="drawer-footer">
        <div v-if="!authStore.isAuthenticated" class="drawer-auth-grid">
          <button class="btn btn-secondary btn-drawer-auth" @click="handleLoginClick">
            <LogIn :size="15" />
            <span>Iniciar Sesión</span>
          </button>
          <button class="btn btn-primary btn-drawer-auth" @click="handleRegisterClick">
            <UserPlus :size="15" />
            <span>Registrar Finca</span>
          </button>
        </div>
        <button v-else class="btn btn-secondary btn-drawer-auth" @click="handleLogout">
          <LogOut :size="15" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(1, 29, 28, 0.85);
  backdrop-filter: blur(8px);
  z-index: 90;
}

.hamburger-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80%;
  max-width: 320px;
  background: var(--color-liquid-deep);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.drawer-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-logo {
  width: 28px;
  height: 28px;
}

.brand-name {
  font-family: var(--font-matter);
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-platinum);
  letter-spacing: -0.04em;
}

.drawer-close-btn {
  background: transparent;
  border: none;
  color: var(--color-silver-mist);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1rem;
}

.user-badge-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-small);
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-small);
  background: rgba(3, 81, 75, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-platinum);
}

.user-name {
  font-weight: 500;
  font-size: 13px;
  color: var(--color-platinum);
}

.user-farm {
  font-size: 11px;
  color: var(--color-liquid-mist);
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-small);
  color: var(--color-silver-mist);
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: all var(--transition-fast);
}

.drawer-link:hover, .drawer-link.router-link-active {
  color: var(--color-platinum);
  background: var(--color-liquid-kelp);
}

.text-mist {
  color: var(--color-liquid-mist);
}

.badge-mini {
  margin-left: auto;
  font-size: 9px;
  font-weight: 500;
  background: var(--color-aurora-gradient);
  color: #222222;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
}

.drawer-footer {
  padding: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.drawer-auth-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.btn-drawer-auth {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 12px;
  font-family: var(--font-matter);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>
