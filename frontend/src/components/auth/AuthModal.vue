<script setup lang="ts">
import { ref } from 'vue';
import { 
  X, Lock, Mail, User as UserIcon, 
  MapPin, AlertCircle, Sparkles, CheckCircle2,
  MailCheck, RefreshCw, ArrowRight
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const loginForm = ref({
  email: '',
  password: '',
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  farmName: '',
  hectares: 10,
  cropType: 'Aguacate Hass',
});

function setDemoFarmer() {
  loginForm.value.email = 'juan@fincaesperanza.com';
  loginForm.value.password = 'Agricultor2026!';
}

function setDemoAdmin() {
  loginForm.value.email = 'admin@gaia-agritech.com';
  loginForm.value.password = 'AdminGaIA2026!';
}

async function handleLogin() {
  await authStore.login(loginForm.value);
}

async function handleRegister() {
  await authStore.register(registerForm.value);
}

function goToVerificationFromLogin() {
  authStore.pendingEmail = loginForm.value.email;
  authStore.authModalTab = 'verification_pending';
  authStore.errorMessage = null;
}
</script>

<template>
  <Transition name="fade">
    <div v-if="authStore.isAuthModalOpen" class="modal-backdrop" @click.self="authStore.closeAuthModal()">
      <div class="modal-dialog auth-dialog">
        <!-- Close Button -->
        <button class="modal-close-btn" @click="authStore.closeAuthModal()" aria-label="Cerrar ventana de autenticación">
          <X :size="20" />
        </button>

        <div class="auth-header">
          <img src="/logo-gaia.svg" alt="GaIA Logo" class="auth-logo" />
          <h2 v-if="authStore.authModalTab !== 'verification_pending'">Portal de Agricultores GaIA</h2>
          <h2 v-else>Verificación de Cuenta</h2>
          <p v-if="authStore.authModalTab !== 'verification_pending'">Supervisa telemetría, autoriza acciones de IA y gestiona suscripciones.</p>
          <p v-else>Valida tu correo para activar el acceso a tu lote agrícola con IA.</p>
        </div>

        <!-- Demo Account Fast Fill Pills (only for login/register) -->
        <div v-if="authStore.authModalTab !== 'verification_pending'" class="demo-pills-wrap">
          <span class="demo-pills-label">Cuentas demo para probar:</span>
          <button type="button" class="demo-pill" @click="setDemoFarmer">
            <Sparkles :size="12" /> Agricultor Demo
          </button>
          <button type="button" class="demo-pill" @click="setDemoAdmin">
            <Sparkles :size="12" /> Administrador GaIA
          </button>
        </div>

        <!-- Tabs (only for login & register) -->
        <div v-if="authStore.authModalTab !== 'verification_pending'" class="auth-tabs">
          <button 
            class="auth-tab" 
            :class="{ active: authStore.authModalTab === 'login' }"
            @click="authStore.authModalTab = 'login'"
          >
            Iniciar Sesión
          </button>
          <button 
            class="auth-tab" 
            :class="{ active: authStore.authModalTab === 'register' }"
            @click="authStore.authModalTab = 'register'"
          >
            Crear Cuenta de Finca
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="authStore.errorMessage && authStore.authModalTab !== 'verification_pending'" class="error-banner">
          <AlertCircle :size="16" />
          <div class="error-banner-content">
            <span>{{ authStore.errorMessage }}</span>
            <button 
              v-if="authStore.errorMessage.includes('confirmada') || authStore.errorMessage.includes('activación')" 
              type="button" 
              class="error-action-btn"
              @click="goToVerificationFromLogin"
            >
              Reenviar correo de validación &rarr;
            </button>
          </div>
        </div>

        <!-- 1. LOGIN FORM -->
        <form v-if="authStore.authModalTab === 'login'" class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <div class="input-with-icon">
              <Mail :size="16" class="input-icon" />
              <input 
                v-model="loginForm.email" 
                type="email" 
                class="form-control" 
                placeholder="juan@fincaesperanza.com" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div class="input-with-icon">
              <Lock :size="16" class="input-icon" />
              <input 
                v-model="loginForm.password" 
                type="password" 
                class="form-control" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-submit" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading">Verificando credenciales...</span>
            <span v-else>Acceder a mi Dashboard</span>
          </button>

          <div class="auth-switch-text">
            <span>¿Aún no tienes cuenta de finca?</span>
            <button type="button" class="auth-switch-btn" @click="authStore.authModalTab = 'register'">
              Crear cuenta de finca aquí
            </button>
          </div>
        </form>

        <!-- 2. REGISTER FORM -->
        <form v-else-if="authStore.authModalTab === 'register'" class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label">Nombre del Productor / Responsable *</label>
            <div class="input-with-icon">
              <UserIcon :size="16" class="input-icon" />
              <input v-model="registerForm.name" type="text" class="form-control" placeholder="Carlos Gómez" required />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Correo Electrónico *</label>
              <div class="input-with-icon">
                <Mail :size="16" class="input-icon" />
                <input v-model="registerForm.email" type="email" class="form-control" placeholder="carlos@agro.com" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña *</label>
              <div class="input-with-icon">
                <Lock :size="16" class="input-icon" />
                <input v-model="registerForm.password" type="password" class="form-control" placeholder="Mínimo 6 caracteres" required />
              </div>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Nombre de la Finca o Lote</label>
              <div class="input-with-icon">
                <MapPin :size="16" class="input-icon" />
                <input v-model="registerForm.farmName" type="text" class="form-control" placeholder="Finca San Francisco" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Hectáreas</label>
              <input v-model.number="registerForm.hectares" type="number" min="0.5" step="0.5" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cultivo Principal</label>
            <input v-model="registerForm.cropType" type="text" class="form-control" placeholder="Aguacate Hass, Maíz, Café, Plátano..." />
          </div>

          <button type="submit" class="btn btn-primary btn-submit" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading">Creando cuenta y despachando validación...</span>
            <span v-else>Completar Registro GaIA</span>
          </button>

          <div class="auth-switch-text">
            <span>¿Ya tienes una cuenta registrada?</span>
            <button type="button" class="auth-switch-btn" @click="authStore.authModalTab = 'login'">
              Inicia sesión aquí
            </button>
          </div>
        </form>

        <!-- 3. VERIFICATION PENDING VIEW -->
        <div v-else-if="authStore.authModalTab === 'verification_pending'" class="verification-view">
          <div class="verification-badge-container">
            <div class="badge-icon-box">
              <MailCheck :size="34" class="verification-icon" />
            </div>
          </div>

          <h3 class="verification-title">¡Revisa tu Correo de Validación!</h3>
          <p class="verification-desc">
            Hemos despachado un enlace seguro de activación a:
          </p>
          <div class="email-highlight-badge">
            <Mail :size="14" />
            <span class="email-text">{{ authStore.pendingEmail || 'tu correo registrado' }}</span>
          </div>

          <!-- Step Guide Card -->
          <div class="steps-card">
            <div class="step-item">
              <div class="step-num">1</div>
              <div class="step-info">
                <strong>Abre tu bandeja de entrada</strong>
                <span>Busca el mensaje de confirmación enviado por GaIA AgroTech (o Supabase).</span>
              </div>
            </div>
            <div class="step-item">
              <div class="step-num">2</div>
              <div class="step-info">
                <strong>Haz clic en "Confirm your mail" / "Confirmar cuenta"</strong>
                <span>El enlace activará tu suscripción de productor y verificará tus credenciales.</span>
              </div>
            </div>
            <div class="step-item">
              <div class="step-num">3</div>
              <div class="step-info">
                <strong>Acceso automático concedido</strong>
                <span>Serás redirigido con tu sesión iniciada directamente a tu lote y la tienda.</span>
              </div>
            </div>
          </div>

          <!-- Spam notice -->
          <p class="spam-hint">
            💡 ¿No ves el correo? Revisa en tu carpeta de <strong>Spam o Correo no deseado</strong> o en la pestaña de <em>Promociones</em>.
          </p>

          <!-- Success Alert when Resend succeeds -->
          <div v-if="authStore.resendSuccessMessage" class="resend-success-banner">
            <CheckCircle2 :size="16" />
            <span>{{ authStore.resendSuccessMessage }}</span>
          </div>

          <!-- Resend Error Banner -->
          <div v-if="authStore.errorMessage" class="error-banner">
            <AlertCircle :size="16" />
            <span>{{ authStore.errorMessage }}</span>
          </div>

          <!-- Resend Action Button -->
          <div class="verification-actions">
            <button 
              type="button" 
              class="btn-resend" 
              :disabled="authStore.isResending" 
              @click="authStore.resendVerificationEmail()"
            >
              <RefreshCw :size="15" :class="{ 'spin-icon': authStore.isResending }" />
              <span>{{ authStore.isResending ? 'Reenviando correo...' : 'Reenviar Correo de Validación' }}</span>
            </button>
          </div>

          <div class="verification-footer">
            <button type="button" class="auth-switch-btn" @click="authStore.authModalTab = 'login'">
              &larr; Volver a Iniciar Sesión
            </button>
            <span class="dot-separator">•</span>
            <button type="button" class="auth-switch-btn" @click="authStore.authModalTab = 'register'">
              Modificar correo de registro
            </button>
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
}

.auth-dialog {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  width: 520px;
  max-width: 95vw;
  position: relative;
  padding: 2.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
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
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-logo {
  width: 42px;
  height: 42px;
  margin: 0 auto 0.75rem auto;
}

.auth-header h2 {
  font-family: var(--font-matter);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-platinum);
  margin-bottom: 0.35rem;
}

.auth-header p {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  line-height: 1.4;
}

.demo-pills-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-pills-label {
  font-family: var(--font-matter);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-silver-mist);
}

.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-liquid-mist);
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.demo-pill:hover {
  background: var(--color-aurora-gradient);
  color: #012624;
  border-color: transparent;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 1.5rem;
}

.auth-tab {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem;
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-silver-mist);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.auth-tab.active {
  color: var(--color-platinum);
  border-bottom-color: var(--color-liquid-mist);
}

.error-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-button);
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 12.5px;
  line-height: 1.4;
  margin-bottom: 1.25rem;
}

.error-banner-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.error-action-btn {
  background: none;
  border: none;
  color: #70ffe5;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  margin-bottom: 6px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--color-silver-mist);
  pointer-events: none;
}

.input-with-icon .form-control {
  padding-left: 2.3rem;
}

.form-control {
  width: 100%;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding: 10px 14px;
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-platinum);
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  border-color: rgba(203, 255, 252, 0.4);
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

@media (max-width: 500px) {
  .form-row-2 {
    grid-template-columns: 1fr;
  }
}

.btn-submit {
  width: 100%;
  padding: 11px;
  margin-top: 0.75rem;
  border-radius: var(--radius-button);
  background: var(--color-aurora-gradient);
  color: #012624;
  font-family: var(--font-matter);
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast), filter var(--transition-fast);
}

.btn-submit:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch-text {
  margin-top: 1.25rem;
  text-align: center;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.auth-switch-btn {
  background: none;
  border: none;
  color: #00dfa2;
  font-family: var(--font-matter);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  transition: color var(--transition-fast);
}

.auth-switch-btn:hover {
  color: #70ffe5;
}

/* VERIFICATION PENDING STYLES */
.verification-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.verification-badge-container {
  margin-bottom: 1rem;
}

.badge-icon-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 223, 162, 0.25) 0%, rgba(1, 38, 36, 0.8) 100%);
  border: 1px solid rgba(0, 223, 162, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(0, 223, 162, 0.35);
  animation: pulse-glow 3s infinite ease-in-out;
}

.verification-icon {
  color: #00dfa2;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 16px rgba(0, 223, 162, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 223, 162, 0.6);
    transform: scale(1.05);
  }
}

.verification-title {
  font-family: var(--font-matter);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-platinum);
  margin-bottom: 0.35rem;
}

.verification-desc {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  margin-bottom: 0.6rem;
}

.email-highlight-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(0, 223, 162, 0.4);
  padding: 6px 14px;
  border-radius: var(--radius-button);
  color: #70ffe5;
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.steps-card {
  width: 100%;
  background: rgba(0, 55, 52, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  padding: 1rem 1.15rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-aurora-gradient);
  color: #012624;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-info strong {
  font-size: 12.5px;
  color: var(--color-platinum);
  font-weight: 500;
}

.step-info span {
  font-size: 11.5px;
  color: var(--color-silver-mist);
  line-height: 1.35;
}

.spam-hint {
  font-size: 11.5px;
  color: var(--color-silver-mist);
  margin-bottom: 1.25rem;
  line-height: 1.4;
}

.resend-success-banner {
  width: 100%;
  background: rgba(0, 223, 162, 0.12);
  border: 1px solid rgba(0, 223, 162, 0.4);
  color: #70ffe5;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 12.5px;
  margin-bottom: 1rem;
  text-align: left;
}

.verification-actions {
  width: 100%;
  margin-bottom: 1.25rem;
}

.btn-resend {
  width: 100%;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--color-platinum);
  padding: 10px 16px;
  border-radius: var(--radius-button);
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-resend:hover:not(:disabled) {
  background: rgba(0, 78, 74, 0.7);
  border-color: rgba(0, 223, 162, 0.4);
  color: #70ffe5;
}

.btn-resend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin-icon {
  animation: spin 1s linear infinite;
}

.verification-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 12px;
}

.dot-separator {
  color: rgba(255, 255, 255, 0.2);
}
</style>
