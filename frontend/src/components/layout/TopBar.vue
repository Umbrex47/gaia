<script setup lang="ts">
import { ShieldCheck, Sparkles, Phone, MapPin, UserPlus } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-left">
        <span class="topbar-item">
          <ShieldCheck class="topbar-icon text-mist" :size="13" />
          <span>HARDWARE INTEGRADO & IA AUTÓNOMA</span>
        </span>
        <span class="topbar-divider hide-on-mobile"></span>
        <span class="topbar-item hide-on-mobile">
          <Sparkles class="topbar-icon text-aurora" :size="13" />
          <span>AGENTES SENTINEL & HYDRO V2.4 ONLINE</span>
        </span>
      </div>

      <div class="topbar-right">
        <button 
          v-if="!authStore.isAuthenticated" 
          type="button" 
          class="topbar-reg-btn hide-on-mobile"
          @click="authStore.openAuthModal('register')"
        >
          <UserPlus :size="12" />
          <span>REGISTRAR FINCA</span>
        </button>
        <span v-if="!authStore.isAuthenticated" class="topbar-divider hide-on-mobile"></span>
        <a href="tel:+573008004242" class="topbar-link">
          <Phone :size="12" />
          <span>+57 (300) 800-GAIA</span>
        </a>
        <span class="topbar-divider hide-on-mobile"></span>
        <span class="topbar-item hide-on-mobile text-mist">
          <MapPin :size="12" />
          <span>ABYSSAL TECH TERMINAL</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  background: var(--color-liquid-deep);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  font-family: var(--font-matter);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 40;
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-left, .topbar-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.topbar-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.topbar-icon {
  flex-shrink: 0;
}

.text-mist {
  color: var(--color-liquid-mist);
}

.text-aurora {
  color: var(--color-aurora-gradient);
}

.topbar-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-silver-mist);
  transition: color var(--transition-fast);
}

.topbar-link:hover {
  color: var(--color-platinum);
}

.topbar-divider {
  width: 1px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.topbar-reg-btn {
  background: none;
  border: 1px solid rgba(0, 223, 162, 0.3);
  color: #00dfa2;
  font-family: var(--font-matter);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all var(--transition-fast);
}

.topbar-reg-btn:hover {
  background: rgba(0, 223, 162, 0.15);
  border-color: #00dfa2;
  color: #ffffff;
}
</style>
