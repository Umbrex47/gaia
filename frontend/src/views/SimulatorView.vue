<script setup lang="ts">
import CropSimulator from '../components/simulator/CropSimulator.vue';
import { Cpu, Info, Shield, Radio, Sparkles } from 'lucide-vue-next';
</script>

<template>
  <main class="simulator-page">
    <div class="container sim-page-container">
      <div class="sim-page-header">
        <div class="badge-tag">
          <Cpu :size="14" /> Tinkercad Agrícola
        </div>
        <h1 class="sim-page-title">Laboratorio de Simulación de Cultivos GaIA</h1>
        <p class="sim-page-desc">
          Prueba el comportamiento de componentes de hardware reales (sensores de suelo, electroválvulas y drones) antes de comprarlos.
          El motor agronómico evalúa el balance hídrico y las decisiones tomadas por los agentes de IA en tiempo real.
        </p>

        <!-- Guide Banner -->
        <div class="sim-guide-banner gaia-card">
          <div class="guide-item">
            <span class="guide-num">1</span>
            <p><strong>Elige el Escenario:</strong> Haz clic en presets como "Sequía" u "Ola de Calor", o ajusta los sliders manualmente.</p>
          </div>
          <div class="guide-item">
            <span class="guide-num">2</span>
            <p><strong>Instala Hardware:</strong> Activa el sensor SoilSense, la válvula HydroValve o el dron AeroScout en el panel izquierdo.</p>
          </div>
          <div class="guide-item">
            <span class="guide-num">3</span>
            <p><strong>Observa la Reacción:</strong> Lee la consola de agentes de IA y añade el kit probado directamente al carrito de compras.</p>
          </div>
        </div>
      </div>

      <!-- The Core Simulator Component -->
      <CropSimulator />
    </div>
  </main>
</template>

<style scoped>
.simulator-page {
  padding: 3rem 0 5rem 0;
  min-height: calc(100vh - var(--header-height));
  background: var(--color-liquid-abyss);
}

.sim-page-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 3rem auto;
}

.sim-page-title {
  font-family: var(--font-matter);
  font-size: 36px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-platinum);
  margin: 0.5rem 0 1rem 0;
  line-height: 1.15;
}

.sim-page-desc {
  font-family: var(--font-matter);
  font-size: 16px;
  color: var(--color-silver-mist);
  line-height: 1.5;
  margin-bottom: 2rem;
}

.sim-guide-banner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: var(--color-liquid-kelp);
  border: none;
  border-radius: var(--radius-card);
  box-shadow: none;
  text-align: left;
}

@media (max-width: 768px) {
  .sim-guide-banner {
    grid-template-columns: 1fr;
  }
}

.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.guide-num {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-platinum);
  font-family: var(--font-matter);
  font-weight: 500;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-item p {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  line-height: 1.45;
  margin: 0;
}

.guide-item strong {
  color: var(--color-platinum);
  font-weight: 500;
}
</style>
