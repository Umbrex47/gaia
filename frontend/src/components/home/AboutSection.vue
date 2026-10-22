<script setup lang="ts">
import { ArrowUpRight, Check } from 'lucide-vue-next';
</script>

<template>
  <section id="nosotros" class="section about-section">
    <div class="container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">
          ARQUITECTURA & FILOSOFÍA
        </span>
        <h2 class="section-title">El Puente entre el Terreno y la IA de Borde</h2>
        <p class="section-subtitle">
          Nacimos con un principio rector: no inventar hardware cautivo, sino orquestar los mejores sensores y actuadores del planeta con el software de IA más avanzado del agro.
        </p>
      </div>

      <!-- Dual Area Architecture Grid -->
      <div class="grid-2 architecture-split">
        <!-- Area 1: Hardware Integrado (Surface Card #003734, 16px radius, 36px padding) -->
        <div class="gaia-card split-card">
          <div class="card-top-action">
            <span class="card-eyebrow">ÁREA 1: HARDWARE INTEGRADO</span>
            <div class="btn-arrow-icon" aria-hidden="true">
              <ArrowUpRight :size="16" />
            </div>
          </div>
          <h3 class="card-heading">Flexibilidad Total: Sin Hardware Propietario</h3>
          <p class="card-text">
            No obligamos al productor a comprar cajas negras cautivas. Evaluamos la topografía, el perfil radicular y la disponibilidad hídrica para integrar dispositivos industriales certificados:
          </p>
          <ul class="feature-bullets">
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Sensores de Suelo & Microclima:</strong> SDI-12, LoRaWAN y Modbus de grado industrial.</span>
            </li>
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Electroválvulas & Nodos ESP32/ARM:</strong> Alimentación fotovoltaica biestable 100% autónoma.</span>
            </li>
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Drones Multiespectrales:</strong> ArduPilot / DJI Enterprise con reflectancia de 5 bandas.</span>
            </li>
          </ul>
        </div>

        <!-- Area 2: Software & Agentes de IA -->
        <div class="gaia-card split-card">
          <div class="card-top-action">
            <span class="card-eyebrow highlight-mist">ÁREA 2: SOFTWARE & CEREBRO IA (NUESTRO VALOR)</span>
            <div class="btn-arrow-icon" aria-hidden="true">
              <ArrowUpRight :size="16" />
            </div>
          </div>
          <h3 class="card-heading">El Verdadero Valor: Agentes Autónomos GaIA</h3>
          <p class="card-text">
            El valor transformador reside en el software: una plataforma de borde (Edge AI) que analiza variables biofísicas y toma decisiones ejecutivas en milisegundos:
          </p>
          <ul class="feature-bullets">
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Monitoreo de Demanda Radicular:</strong> Evapotranspiración ETo predictiva en tiempo real.</span>
            </li>
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Acción en Bucle Cerrado:</strong> Apertura milimétrica de válvulas y patrullaje de drones.</span>
            </li>
            <li>
              <span class="bullet-check"><Check :size="12" /></span>
              <span><strong>Autonomía Ajustable:</strong> Tú decides en qué momento delegar 100% o supervisar con alertas.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Recessed Surface Card #011d1c (Liquid Deep) for Cost Model -->
      <div class="recessed-card cost-transparency-card mt-5">
        <div class="cost-header">
          <span class="section-eyebrow">MODELO DE INGRESOS TRANSPARENTE</span>
          <h3 class="cost-title">Estructura Financiera: Cero Costos Ocultos</h3>
          <p class="cost-desc">Dividimos la inversión en dos fases claras para maximizar la rentabilidad de tu predio:</p>
        </div>

        <div class="cost-columns-grid">
          <div class="cost-col">
            <h4 class="cost-col-name">1. Costos Variables Iniciales (Instalación)</h4>
            <p class="cost-col-desc">Inversión única al implementar la infraestructura:</p>
            <ul class="cost-list">
              <li>Adquisición de hardware calibrado para tu cultivo</li>
              <li>Gastos de transporte y despacho protegido</li>
              <li>Instalación y levantamiento de mapa LoRaWAN por ingenieros GaIA</li>
              <li>Calibración radicular y prueba de telemetría in situ</li>
            </ul>
          </div>

          <div class="cost-col">
            <h4 class="cost-col-name">2. Suscripción Mensual Fija (SaaS & Mantenimiento)</h4>
            <p class="cost-col-desc">Cuota mensual por hectárea monitoreada:</p>
            <ul class="cost-list">
              <li>Licencia de software GaIA y agentes de IA autónomos</li>
              <li>Actualización periódica de modelos de inferencia agronómica</li>
              <li>Mesa de ayuda agronómica prioritaria y telemetría continua</li>
              <li>Servicio Premium: Flotas de drones y modelos a medida</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  position: relative;
  background-color: var(--color-liquid-abyss);
}

.architecture-split {
  align-items: stretch;
}

.split-card {
  display: flex;
  flex-direction: column;
}

.card-top-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-20);
}

.card-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.highlight-mist {
  color: var(--color-liquid-mist);
}

.card-heading {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: var(--spacing-16);
  color: var(--color-platinum);
  letter-spacing: -0.48px;
}

.card-text {
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-silver-mist);
  margin-bottom: var(--spacing-24);
  flex: 1;
}

.feature-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-bullets li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-silver-mist);
}

.bullet-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(3, 81, 75, 0.6);
  color: var(--color-liquid-mist);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.feature-bullets li strong {
  color: var(--color-platinum);
  font-weight: 500;
}

.mt-5 {
  margin-top: var(--spacing-40);
}

/* Recessed Card (Liquid Deep #011d1c) */
.cost-transparency-card {
  background: var(--color-liquid-deep);
  border-radius: var(--radius-cards);
  padding: var(--spacing-48);
}

.cost-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto var(--spacing-36) auto;
}

.cost-title {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.cost-desc {
  font-size: 15px;
  color: var(--color-silver-mist);
}

.cost-columns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-32);
}

@media (max-width: 768px) {
  .cost-columns-grid {
    grid-template-columns: 1fr;
  }
}

.cost-col {
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-small);
  padding: var(--spacing-28);
}

.cost-col-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-liquid-mist);
  margin-bottom: 0.4rem;
}

.cost-col-desc {
  font-size: 13px;
  color: var(--color-silver-mist);
  margin-bottom: 1rem;
}

.cost-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 14px;
  color: var(--color-silver-mist);
}

.cost-list li {
  position: relative;
  padding-left: 1.2rem;
  line-height: 1.4;
}

.cost-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-liquid-mist);
}
</style>
