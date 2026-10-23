import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { api } from '../services/api';
import { supabaseAuthService } from '../services/supabaseAuth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('gaia_token'));
  const isAuthModalOpen = ref(false);
  const authModalTab = ref<'login' | 'register' | 'verification_pending'>('login');
  const pendingEmail = ref<string>('');
  const isLoading = ref(false);
  const isResending = ref(false);
  const errorMessage = ref<string | null>(null);
  const resendSuccessMessage = ref<string | null>(null);

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

  function openAuthModal(tab: 'login' | 'register' | 'verification_pending' = 'login') {
    authModalTab.value = tab;
    errorMessage.value = null;
    resendSuccessMessage.value = null;
    isAuthModalOpen.value = true;
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false;
    errorMessage.value = null;
    resendSuccessMessage.value = null;
  }

  async function login(credentials: { email: string; password: string }) {
    isLoading.value = true;
    errorMessage.value = null;
    resendSuccessMessage.value = null;

    try {
      // 1. Intentar autenticación directa con Supabase
      try {
        const supaResult = await supabaseAuthService.login(credentials);
        token.value = supaResult.session.access_token;
        user.value = supaResult.user;
        localStorage.setItem('gaia_token', supaResult.session.access_token);
        localStorage.setItem('gaia_user', JSON.stringify(supaResult.user));
        closeAuthModal();
        return true;
      } catch (supaErr: any) {
        if (supaErr?.code === 'EMAIL_NOT_CONFIRMED') {
          pendingEmail.value = credentials.email;
          authModalTab.value = 'verification_pending';
          errorMessage.value = supaErr.message;
          return false;
        }
        // Si no es por falta de verificación, intentar con API de respaldo o propagar
        if (credentials.email === 'juan@fincaesperanza.com' || credentials.email === 'admin@gaia-agritech.com') {
          const data = await api.login(credentials);
          token.value = data.access_token;
          user.value = data.user;
          localStorage.setItem('gaia_token', data.access_token);
          localStorage.setItem('gaia_user', JSON.stringify(data.user));
          closeAuthModal();
          return true;
        }
        throw supaErr;
      }
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
    resendSuccessMessage.value = null;

    try {
      // Registrar con Supabase Auth enviando email de validación
      const result = await supabaseAuthService.register(formData);

      if (result.requiresEmailConfirmation) {
        // Correo de validación despachado por Supabase
        pendingEmail.value = formData.email;
        authModalTab.value = 'verification_pending';
        return true;
      } else if (result.session && result.user) {
        // En caso de que la confirmación de email esté desactivada
        const userProfile = supabaseAuthService.mapUser(result.user);
        token.value = result.session.access_token;
        user.value = userProfile;
        localStorage.setItem('gaia_token', result.session.access_token);
        localStorage.setItem('gaia_user', JSON.stringify(userProfile));
        closeAuthModal();
        return true;
      }

      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al crear la cuenta en Supabase';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function resendVerificationEmail(emailOverride?: string) {
    const targetEmail = emailOverride || pendingEmail.value;
    if (!targetEmail) {
      errorMessage.value = 'No se ha especificado un correo para reenviar la validación.';
      return false;
    }

    isResending.value = true;
    errorMessage.value = null;
    resendSuccessMessage.value = null;

    try {
      const res = await supabaseAuthService.resendVerification(targetEmail);
      resendSuccessMessage.value = res.message;
      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Error al reenviar el correo de validación';
      return false;
    } finally {
      isResending.value = false;
    }
  }

  async function verifyManualToken(tokenOrUrl: string): Promise<boolean> {
    const targetEmail = pendingEmail.value || user.value?.email || '';
    if (!tokenOrUrl.trim()) {
      errorMessage.value = 'Por favor ingresa un código o enlace de validación.';
      return false;
    }

    isLoading.value = true;
    errorMessage.value = null;

    try {
      const res = await supabaseAuthService.verifyOtpToken(targetEmail, tokenOrUrl);
      if (res.session && res.user) {
        setUserFromSession(res.user, res.session.access_token);
        closeAuthModal();
        return true;
      }
      throw new Error('No se pudo verificar la sesión.');
    } catch (err: any) {
      errorMessage.value = err.message || 'Código o enlace no válido o expirado.';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function setUserFromSession(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;
    localStorage.setItem('gaia_token', newToken);
    localStorage.setItem('gaia_user', JSON.stringify(newUser));
  }

  function logout() {
    supabaseAuthService.signOut().catch(() => {});
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
    pendingEmail,
    isLoading,
    isResending,
    errorMessage,
    resendSuccessMessage,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    verifyManualToken,
    resendVerificationEmail,
    setUserFromSession,
    logout,
  };
});
