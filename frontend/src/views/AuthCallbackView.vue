<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, AlertCircle, Loader2, Sparkles, 
  ArrowRight, RefreshCw, Sprout, MapPin, Mail, Home
} from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { supabaseAuthService } from '../services/supabaseAuth';
import type { User } from '../types';

const router = useRouter();
const authStore = useAuthStore();

const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('');
const verifiedUser = ref<User | null>(null);
const redirectCountdown = ref(5);
let timer: any = null;

// For resending if link was expired
const resendEmail = ref('');
const isResending = ref(false);
const resendMessage = ref<string | null>(null);

function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00dfa2', '#70ffe5', '#cbfffc', '#fef9c3', '#10b981'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00dfa2', '#70ffe5', '#ffffff'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00dfa2', '#70ffe5', '#ffffff'],
      });
    }, 400);
  } catch (e) {
    console.warn('Confetti effect failed', e);
  }
}

function startCountdown() {
  timer = setInterval(() => {
    if (redirectCountdown.value > 1) {
      redirectCountdown.value--;
    } else {
      clearInterval(timer);
      goToDashboard();
    }
  }, 1000);
}

function goToDashboard() {
  if (timer) clearInterval(timer);
  router.push('/tienda');
}

function goToHome() {
  if (timer) clearInterval(timer);
  router.push('/');
}

async function handleResend() {
  if (!resendEmail.value) return;
  isResending.value = true;
  resendMessage.value = null;
  errorMessage.value = '';
  try {
    const res = await supabaseAuthService.resendVerification(resendEmail.value);
    resendMessage.value = res.message;
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al reenviar el correo de validación';
  } finally {
    isResending.value = false;
  }
}

onMounted(async () => {
  try {
    status.value = 'loading';
    const result = await supabaseAuthService.handleAuthCallback();

    if (result && result.session && result.user) {
      verifiedUser.value = result.user;
      authStore.setUserFromSession(result.user, result.session.access_token);
      status.value = 'success';
      triggerConfetti();
      startCountdown();
    } else {
      status.value = 'error';
      errorMessage.value = 'No se encontró un token o código de validación válido en el enlace. Es posible que ya haya sido utilizado o haya expirado.';
    }
  } catch (err: any) {
    status.value = 'error';
    const msg = err.message || '';
    if (msg.includes('expired') || msg.includes('invalid') || msg.includes('Token has expired')) {
      errorMessage.value = 'El enlace de validación ha expirado o ya fue utilizado previamente.';
    } else {
      errorMessage.value = err.message || 'Ocurrió un error al procesar la validación de tu cuenta.';
    }
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="callback-view">
    <div class="callback-card">
      <!-- 1. LOADING STATE -->
      <div v-if="status === 'loading'" class="state-container">
        <div class="spinner-box">
          <Loader2 :size="48" class="spin-icon text-cyan" />
        </div>
        <h2 class="state-title">Verificando tu cuenta GaIA...</h2>
        <p class="state-desc">
          Estamos procesando tus credenciales y activando los permisos para tu predio agrícola.
        </p>
      </div>

      <!-- 2. SUCCESS STATE -->
      <div v-else-if="status === 'success'" class="state-container">
        <div class="success-badge-box">
          <CheckCircle2 :size="52" class="success-icon" />
        </div>

        <div class="verified-pill">
          <Sparkles :size="13" />
          <span>CUENTA VALIDADA & ACTIVADA</span>
        </div>

        <h2 class="state-title">¡Bienvenido a GaIA AgroTech!</h2>
        <p class="state-desc">
          Hola <strong>{{ verifiedUser?.name || 'Productor' }}</strong>, tu correo ha sido validado exitosamente. Tu cuenta de productor ya se encuentra activa y vinculada al ecosistema GaIA.
        </p>

        <!-- Producer Farm Overview Card -->
        <div class="farm-details-card">
          <div class="farm-detail-item">
            <MapPin :size="16" class="text-emerald" />
            <div>
              <span class="detail-label">Finca registrada</span>
              <p class="detail-val">{{ verifiedUser?.farmName || 'Predio Agrícola' }}</p>
            </div>
          </div>
          <div class="farm-detail-item">
            <Sprout :size="16" class="text-emerald" />
            <div>
              <span class="detail-label">Cultivo & Extensión</span>
              <p class="detail-val">{{ verifiedUser?.cropType }} • {{ verifiedUser?.hectares }} Ha</p>
            </div>
          </div>
        </div>

        <p class="redirect-notice">
          Redirigiendo automáticamente a la tienda y catálogo de hardware en <strong>{{ redirectCountdown }}</strong> segundos...
        </p>

        <div class="action-buttons">
          <button type="button" class="btn btn-primary btn-cta" @click="goToDashboard">
            <span>Explorar Hardware & Sensores</span>
            <ArrowRight :size="16" />
          </button>
          <button type="button" class="btn btn-secondary btn-home" @click="goToHome">
            <Home :size="16" />
            <span>Ir al Inicio</span>
          </button>
        </div>
      </div>

      <!-- 3. ERROR STATE -->
      <div v-else class="state-container">
        <div class="error-badge-box">
          <AlertCircle :size="52" class="error-icon" />
        </div>

        <h2 class="state-title">No pudimos validar tu enlace</h2>
        <p class="state-desc">
          {{ errorMessage }}
        </p>

        <!-- Resend Form Box -->
        <div class="resend-box">
          <p class="resend-title">Ingresa tu correo para recibir un nuevo enlace de activación:</p>
          <div class="resend-input-wrap">
            <Mail :size="16" class="input-icon" />
            <input 
              v-model="resendEmail" 
              type="email" 
              class="form-control" 
              placeholder="tu-correo@finca.com" 
            />
          </div>
          <button 
            type="button" 
            class="btn btn-primary btn-resend-action" 
            :disabled="isResending || !resendEmail"
            @click="handleResend"
          >
            <RefreshCw :size="15" :class="{ 'spin-icon': isResending }" />
            <span>{{ isResending ? 'Enviando...' : 'Reenviar Enlace de Activación' }}</span>
          </button>

          <div v-if="resendMessage" class="resend-success-msg">
            <CheckCircle2 :size="16" />
            <span>{{ resendMessage }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="authStore.openAuthModal('login'); router.push('/')"
          >
            <span>Ir a Iniciar Sesión</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="router.push('/')">
            <Home :size="16" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.callback-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: radial-gradient(circle at 50% 30%, rgba(0, 55, 52, 0.35) 0%, rgba(1, 38, 36, 0.95) 100%);
}

.callback-card {
  width: 100%;
  max-width: 540px;
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-card);
  padding: 2.75rem 2.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner-box,
.success-badge-box,
.error-badge-box {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.spinner-box {
  background: rgba(1, 38, 36, 0.8);
  border: 1px solid rgba(112, 255, 229, 0.3);
}

.success-badge-box {
  background: radial-gradient(circle, rgba(0, 223, 162, 0.25) 0%, rgba(1, 38, 36, 0.9) 100%);
  border: 2px solid rgba(0, 223, 162, 0.7);
  box-shadow: 0 0 35px rgba(0, 223, 162, 0.45);
}

.success-icon {
  color: #00dfa2;
}

.error-badge-box {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(1, 38, 36, 0.9) 100%);
  border: 2px solid rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
}

.error-icon {
  color: #ef4444;
}

.text-cyan {
  color: #70ffe5;
}

.text-emerald {
  color: #00dfa2;
}

.verified-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 223, 162, 0.15);
  border: 1px solid rgba(0, 223, 162, 0.4);
  color: #70ffe5;
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.state-title {
  font-family: var(--font-matter);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-platinum);
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
}

.state-desc {
  font-family: var(--font-matter);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-silver-mist);
  margin-bottom: 1.5rem;
}

.farm-details-card {
  width: 100%;
  background: rgba(0, 55, 52, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  padding: 1.15rem 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  text-align: left;
  margin-bottom: 1.5rem;
}

@media (max-width: 520px) {
  .farm-details-card {
    grid-template-columns: 1fr;
  }
}

.farm-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
}

.detail-label {
  display: block;
  font-family: var(--font-matter);
  font-size: 11px;
  color: var(--color-silver-mist);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.detail-val {
  font-family: var(--font-matter);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-platinum);
  margin: 0;
}

.redirect-notice {
  font-family: var(--font-matter);
  font-size: 12.5px;
  color: var(--color-silver-mist);
  margin-bottom: 1.5rem;
}

.redirect-notice strong {
  color: #70ffe5;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.btn-cta {
  width: 100%;
  padding: 12px;
  background: var(--color-aurora-gradient);
  color: #012624;
  font-weight: 600;
  font-size: 14px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast), filter var(--transition-fast);
}

.btn-cta:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-home {
  width: 100%;
  padding: 10px;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-platinum);
  font-size: 13px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-home:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

/* RESEND BOX FOR ERROR STATE */
.resend-box {
  width: 100%;
  background: rgba(0, 55, 52, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.resend-title {
  font-size: 12.5px;
  color: var(--color-platinum);
  margin-bottom: 0.75rem;
}

.resend-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--color-silver-mist);
  pointer-events: none;
}

.resend-input-wrap .form-control {
  padding-left: 2.3rem;
  width: 100%;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding-top: 9px;
  padding-bottom: 9px;
  color: var(--color-platinum);
  font-size: 13.5px;
  outline: none;
}

.btn-resend-action {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-button);
  background: var(--color-aurora-gradient);
  color: #012624;
  font-weight: 600;
  font-size: 13px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-resend-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resend-success-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #70ffe5;
  font-size: 12px;
  margin-top: 0.75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin-icon {
  animation: spin 1.2s linear infinite;
}
</style>