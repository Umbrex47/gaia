<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  Cpu, ArrowUpRight, ShieldCheck, Sparkles, 
  Droplets, Bug, Radio, Play 
} from 'lucide-vue-next';

const router = useRouter();
</script>

<template>
  <section class="hero-section">
    <!-- Bioluminescent Ambient Data Orbs -->
    <div class="bioluminescent-orb orb-1"></div>
    <div class="bioluminescent-orb orb-2"></div>

    <div class="container hero-container">
      <div class="hero-content">
        <!-- Eyebrow: 12px Matter 500, uppercase, letter-spacing 0.12em -->
        <span class="section-eyebrow">
          <span class="pulse-indicator"></span>
          GAIA — ABYSSAL AGROTECH TERMINAL
        </span>

        <!-- Hero Headline: Matter weight 500, line-height 1.0, letter-spacing -0.04em -->
        <h1 class="hero-title">
          La Inteligencia de la Naturaleza, en un Terminal de 
          <span class="highlight-mist">IA Autónoma</span>
        </h1>

        <!-- Subtext: 16px Matter 400, line-height 1.4, Silver Mist -->
        <p class="hero-description">
          GaIA orquesta sensores de grado industrial, electroválvulas solares y drones multiespectrales 
          mediante agentes de IA que monitorean, analizan y actúan con precisión milimétrica en el terreno.
        </p>

        <!-- CTA Group -->
        <div class="hero-cta-group">
          <!-- Signature Aurora Gradient Pill Button -->
          <router-link to="/tienda" class="btn btn-primary btn-aurora">
            <span>EXPLORAR CATÁLOGO & KITS</span>
            <ArrowUpRight :size="16" />
          </router-link>

          <!-- Raised Liquid Kelp Button -->
          <router-link to="/planes" class="btn btn-secondary btn-kelp">
            <span>CALCULAR INVERSIÓN & ROI</span>
          </router-link>
        </div>

        <!-- Metric micro-labels -->
        <div class="hero-trust-row">
          <div class="trust-item">
            <span class="trust-dot"></span>
            <span>HARDWARE ABIERTO INTEGRADO</span>
          </div>
          <div class="trust-item">
            <span class="trust-dot"></span>
            <span>LORAWAN 15KM OFFLINE</span>
          </div>
          <div class="trust-item">
            <span class="trust-dot"></span>
            <span>-42.4% CONSUMO HÍDRICO</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive 3D Particle Sphere Visual & Telemetry Card -->
      <div class="hero-visual-card">
        <!-- Abstract Particle Sphere Animation Element -->
        <div class="particle-sphere-wrapper">
          <div class="particle-sphere">
            <div v-for="i in 18" :key="i" class="particle-ring" :style="{ '--i': i }"></div>
          </div>
        </div>

        <!-- Floating Surface Card in #003734 (Liquid Kelp), 16px radius, NO shadows -->
        <div class="gaia-card hero-instrument-card">
          <div class="card-glass-header">
            <div class="status-indicator">
              <span class="pulse-dot"></span>
              <span class="header-label">GAIA BRAIN SENTINEL V2.4</span>
            </div>
            <span class="tag-edge">EDGE NPU</span>
          </div>

          <div class="visual-crop-preview">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80" 
              alt="Monitoreo inteligente de cultivos GaIA" 
              class="hero-preview-img"
            />
            <div class="hero-overlay-telemetry">
              <div class="telemetry-pill">
                <Droplets :size="12" class="text-mist" />
                <span>HUMEDAD: 42% (ÓPTIMA)</span>
              </div>
              <div class="telemetry-pill">
                <Bug :size="12" class="text-mist" />
                <span>PATRULLAJE DRON: 0 PLAGAS</span>
              </div>
            </div>
          </div>

          <div class="hero-card-footer">
            <div class="card-footer-item">
              <span class="stat-caption">AUTONOMÍA DELEGADA</span>
              <span class="stat-val-small">100% AUTÓNOMO</span>
            </div>
            <router-link to="/tienda" class="btn btn-outline btn-sm">
              <span>VER CATÁLOGO</span>
              <ArrowUpRight :size="12" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  padding: 6rem 0 5rem 0;
  overflow: hidden;
  background-color: var(--color-liquid-abyss);
}

.orb-1 {
  width: 480px;
  height: 480px;
  top: -120px;
  left: -80px;
}

.orb-2 {
  width: 520px;
  height: 520px;
  bottom: -100px;
  right: -60px;
  background: radial-gradient(circle, rgba(203, 255, 252, 0.4) 0%, rgba(250, 209, 255, 0.15) 50%, transparent 75%);
}

.hero-container {
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  align-items: center;
  gap: 3.5rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 1023px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .section-eyebrow {
    justify-content: center;
  }

  .hero-cta-group {
    justify-content: center;
  }

  .hero-trust-row {
    justify-content: center;
  }
}

.pulse-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-bioluminescent-gradient);
  box-shadow: 0 0 8px var(--color-bioluminescent-gradient);
}

.hero-title {
  font-size: clamp(2.6rem, 5.2vw, 4rem);
  font-weight: 500;
  line-height: 1.0;
  margin-bottom: var(--spacing-24);
  letter-spacing: -0.04em;
  color: var(--color-platinum);
}

.highlight-mist {
  color: var(--color-liquid-mist);
}

.hero-description {
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-silver-mist);
  margin-bottom: var(--spacing-36);
  max-width: 580px;
}

.hero-cta-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-16);
  margin-bottom: var(--spacing-40);
  flex-wrap: wrap;
}

.hero-trust-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-24);
  flex-wrap: wrap;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  color: var(--color-silver-mist);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.trust-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-slate-deep);
}

/* Right Visual with Particle Sphere */
.hero-visual-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.particle-sphere-wrapper {
  position: absolute;
  width: 380px;
  height: 380px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.45;
}

.particle-sphere {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateSphere 24s linear infinite;
}

@keyframes rotateSphere {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

.particle-ring {
  position: absolute;
  inset: 0;
  border: 1px dashed rgba(203, 255, 252, 0.3);
  border-radius: 50%;
  transform: rotateX(calc(var(--i) * 20deg)) rotateY(calc(var(--i) * 15deg));
}

/* Instrument Card — 16px radius, #003734, no shadows */
.hero-instrument-card {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 24px;
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-cards);
}

.card-glass-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-platinum);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-aurora-gradient);
}

.tag-edge {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
  background: rgba(1, 38, 36, 0.6);
  padding: 3px 8px;
  border-radius: 4px;
}

.visual-crop-preview {
  position: relative;
  border-radius: var(--radius-small);
  overflow: hidden;
  margin-bottom: 1rem;
  height: 220px;
}

.hero-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85) contrast(1.1);
}

.hero-overlay-telemetry {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.telemetry-pill {
  background: rgba(1, 29, 28, 0.85);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-platinum);
}

.text-mist {
  color: var(--color-liquid-mist);
}

.hero-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1rem;
}

.stat-caption {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  display: block;
}

.stat-val-small {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}
</style>
