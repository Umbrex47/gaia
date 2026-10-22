<script setup lang="ts">
import { ref } from 'vue';
import { 
  X, Lock, Mail, User as UserIcon, 
  MapPin, AlertCircle, Sparkles, CheckCircle2 
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
          <h2>Portal de Agricultores GaIA</h2>
          <p>Supervisa telemetría, autoriza acciones de IA y gestiona suscripciones.</p>
        </div>

        <!-- Demo Account Fast Fill Pills -->
        <div class="demo-pills-wrap">
          <span class="demo-pills-label">Cuentas demo para probar:</span>
          <button type="button" class="demo-pill" @click="setDemoFarmer">
            <Sparkles :size="12" /> Agricultor Demo
          </button>
          <button type="button" class="demo-pill" @click="setDemoAdmin">
            <Sparkles :size="12" /> Administrador GaIA
          </button>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs">
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
        <div v-if="authStore.errorMessage" class="error-banner">
          <AlertCircle :size="16" />
          <span>{{ authStore.errorMessage }}</span>
        </div>

        <!-- LOGIN FORM -->
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

        <!-- REGISTER FORM -->
        <form v-else class="auth-form" @submit.prevent="handleRegister">
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
            <span v-if="authStore.isLoading">Creando cuenta...</span>
            <span v-else>Completar Registro GaIA</span>
          </button>

          <div class="auth-switch-text">
            <span>¿Ya tienes una cuenta registrada?</span>
            <button type="button" class="auth-switch-btn" @click="authStore.authModalTab = 'login'">
              Inicia sesión aquí
            </button>
          </div>
        </form>
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
  width: 500px;
  max-width: 95vw;
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
  width: 40px;
  height: 40px;
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
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--gaia-danger);
  color: #fca5a5;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;
  margin-bottom: 1.25rem;
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
</style>
