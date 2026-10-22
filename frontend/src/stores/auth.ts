import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { api } from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('gaia_token'));
  const isAuthModalOpen = ref(false);
  const authModalTab = ref<'login' | 'register'>('login');
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  // Restore stored user if available
  const storedUser = localStorage.getItem('gaia_user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('gaia_user');
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  function openAuthModal(tab: 'login' | 'register' = 'login') {
    authModalTab.value = tab;
    errorMessage.value = null;
    isAuthModalOpen.value = true;
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false;
    errorMessage.value = null;
  }

  async function login(credentials: { email: string; password: string }) {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const data = await api.login(credentials);
      token.value = data.access_token;
      user.value = data.user;
      localStorage.setItem('gaia_token', data.access_token);
      localStorage.setItem('gaia_user', JSON.stringify(data.user));
      closeAuthModal();
      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al iniciar sesión';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(formData: any) {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const data = await api.register(formData);
      token.value = data.access_token;
      user.value = data.user;
      localStorage.setItem('gaia_token', data.access_token);
      localStorage.setItem('gaia_user', JSON.stringify(data.user));
      closeAuthModal();
      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al crear la cuenta';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('gaia_token');
    localStorage.removeItem('gaia_user');
  }

  return {
    user,
    token,
    isAuthenticated,
    isAuthModalOpen,
    authModalTab,
    isLoading,
    errorMessage,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
  };
});
