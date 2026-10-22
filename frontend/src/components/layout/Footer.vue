<script setup lang="ts">
import { ref } from 'vue';
import { 
  Send, ShieldCheck, Mail, MapPin, 
  Phone, Globe, Github, Twitter, Linkedin, Youtube 
} from 'lucide-vue-next';

const emailInput = ref('');
const subscribed = ref(false);

function handleSubscribe() {
  if (emailInput.value.includes('@')) {
    subscribed.value = true;
    emailInput.value = '';
    setTimeout(() => {
      subscribed.value = false;
    }, 4000);
  }
}
</script>

<template>
  <footer class="footer-root">
    <div class="container footer-container">
      <div class="footer-grid">
        <!-- Brand Info -->
        <div class="footer-col brand-col">
          <div class="footer-brand">
            <img src="/logo-gaia.svg" alt="GaIA Logo" class="footer-logo" />
            <span class="footer-brand-title">GaIA</span>
          </div>
          <p class="footer-tagline">
            La inteligencia de la naturaleza potenciada por agentes de IA autónomos. Del sensor al dron, del análisis a la acción.
          </p>
          <div class="contact-compact">
            <div class="contact-compact-item">
              <MapPin :size="15" />
              <span>Bogotá / Medellín / Silicon Valley</span>
            </div>
            <div class="contact-compact-item">
              <Phone :size="15" />
              <span>+57 (300) 800-GAIA (4242)</span>
            </div>
            <div class="contact-compact-item">
              <Mail :size="15" />
              <span>contacto@gaia-agritech.com</span>
            </div>
          </div>
        </div>

        <!-- Links: Plataforma -->
        <div class="footer-col">
          <h4 class="footer-col-title">Plataforma</h4>
          <ul class="footer-nav-list">
            <li><router-link to="/tienda">Tienda de Hardware</router-link></li>
            <li><router-link to="/planes">Planes & Calculadora</router-link></li>
            <li><router-link to="/nosotros">Filosofía Hardware Abierto</router-link></li>
            <li><router-link to="/blog">Blog & Casos de Éxito</router-link></li>
          </ul>
        </div>

        <!-- Links: Soluciones -->
        <div class="footer-col">
          <h4 class="footer-col-title">Soluciones Agrícolas</h4>
          <ul class="footer-nav-list">
            <li><a href="#features">Agente Hydro (Riego Autónomo)</a></li>
            <li><a href="#features">Agente Sentinel (Control Plagas)</a></li>
            <li><a href="#features">AeroScout X4 (Drones NDVI)</a></li>
            <li><a href="#features">GaIA Brain (Edge Computing)</a></li>
            <li><router-link to="/#faq">Preguntas Frecuentes</router-link></li>
          </ul>
        </div>

        <!-- Newsletter & Community -->
        <div class="footer-col">
          <h4 class="footer-col-title">Boletín Agronómico</h4>
          <p class="newsletter-desc">
            Recibe avances sobre modelos de IA aplicados a la agricultura y actualizaciones de firmware.
          </p>
          <form class="newsletter-form" @submit.prevent="handleSubscribe">
            <input 
              v-model="emailInput" 
              type="email" 
              placeholder="tu@finca.com" 
              class="newsletter-input" 
              required
            />
            <button type="submit" class="newsletter-btn" aria-label="Suscribirse">
              <Send :size="14" />
            </button>
          </form>
          <p v-if="subscribed" class="subscribed-feedback">
            <ShieldCheck :size="14" /> ¡Gracias por suscribirte al boletín de GaIA!
          </p>

          <div class="social-links-wrap">
            <a href="https://twitter.com" target="_blank" rel="noopener" class="social-btn" aria-label="Twitter">
              <Twitter :size="16" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-btn" aria-label="LinkedIn">
              <Linkedin :size="16" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener" class="social-btn" aria-label="GitHub">
              <Github :size="16" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" class="social-btn" aria-label="YouTube">
              <Youtube :size="16" />
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p class="copyright-text">
          &copy; 2026 GaIA AgroTech Inc. Todos los derechos reservados. Diseñado para revolucionar el agro con IA.
        </p>
        <div class="legal-links">
          <a href="#">Términos de Servicio</a>
          <a href="#">Privacidad de Datos Agrícolas</a>
          <a href="#">Garantía de Hardware</a>
          <a href="#">SLA de Suscripción</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-root {
  background: var(--color-liquid-deep);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  padding-top: 120px;
  padding-bottom: 60px;
  margin-top: 5rem;
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
  gap: 2.5rem;
}

@media (max-width: 1023px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 639px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.footer-logo {
  width: 28px;
  height: 28px;
}

.footer-brand-title {
  font-family: var(--font-matter);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-platinum);
}

.footer-tagline {
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-silver-mist);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.contact-compact {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
}

.contact-compact-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-silver-mist);
}

.footer-col-title {
  font-family: var(--font-matter);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-platinum);
  margin-bottom: 1.25rem;
  letter-spacing: -0.01em;
}

.footer-nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
}

.footer-nav-list a {
  font-family: var(--font-matter);
  color: var(--color-silver-mist);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.footer-nav-list a:hover {
  color: var(--color-platinum);
  transform: translateX(2px);
  display: inline-block;
}

.newsletter-desc {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  line-height: 1.4;
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.newsletter-input {
  flex: 1;
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding: 8px 12px;
  color: var(--color-platinum);
  font-family: var(--font-matter);
  font-size: 13px;
  outline: none;
  transition: border-color var(--transition-fast);
}

.newsletter-input:focus {
  border-color: rgba(203, 255, 252, 0.4);
}

.newsletter-btn {
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-platinum);
  padding: 8px 14px;
  border-radius: var(--radius-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.newsletter-btn:hover {
  background: var(--color-aurora-gradient);
  color: #012624;
  border-color: transparent;
}

.subscribed-feedback {
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-liquid-mist);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.social-links-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.social-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-silver-mist);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.social-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.5rem;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-links {
  display: flex;
  gap: 1.25rem;
}

.legal-links a {
  color: var(--color-silver-mist);
  transition: color var(--transition-fast);
}

.legal-links a:hover {
  color: var(--color-platinum);
}
</style>
