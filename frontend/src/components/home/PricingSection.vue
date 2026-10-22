<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Check, ArrowUpRight } from 'lucide-vue-next';

const router = useRouter();

// Interactive Calculator State
const hectares = ref(15);
const cropType = ref('aguacate');
const requiresDrones = ref(false);

const estimatedInitialInstall = computed(() => {
  let baseInstall = 350;
  let hardwareCost = hectares.value * 95;
  if (requiresDrones.value) {
    hardwareCost += 3450;
  }
  return Math.round(baseInstall + hardwareCost);
});

const estimatedMonthlySubscription = computed(() => {
  let perHectareRate = 18;
  if (hectares.value > 20) perHectareRate = 14;
  if (hectares.value > 50) perHectareRate = 9;
  
  let sub = Math.max(35, hectares.value * perHectareRate);
  if (requiresDrones.value) sub += 120;
  return Math.round(sub);
});

const estimatedAnnualSavings = computed(() => {
  return Math.round(hectares.value * 530);
});

const estimatedRoiMonths = computed(() => {
  const totalFirstYearCost = estimatedInitialInstall.value + (estimatedMonthlySubscription.value * 12);
  const months = (totalFirstYearCost / (estimatedAnnualSavings.value / 12));
  return Math.max(4, Math.round(months * 10) / 10);
});

function goToContact(planName: string) {
  router.push({ path: '/contacto', query: { plan: planName, hectares: hectares.value.toString() } });
}
</script>

<template>
  <section id="planes" class="section pricing-section">
    <div class="container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">
          PLANES & CALCULADORA
        </span>
        <h2 class="section-title">Inversión Adaptable a Cada Escala Agrícola</h2>
        <p class="section-subtitle">
          Pago inicial transparente por hardware e instalación + mensualidad flexible por hectárea monitoreada. Sin costos ocultos.
        </p>
      </div>

      <!-- 3 Subscription Tier Cards -->
      <div class="grid-3 pricing-cards-grid">
        <!-- Tier 1: Semilla -->
        <div class="gaia-card pricing-card">
          <div class="tier-header">
            <span class="tier-eyebrow">PEQUEÑAS PARCELAS</span>
            <h3 class="tier-name">Plan Semilla</h3>
            <p class="tier-desc">Ideal para huertos familiares y parcelas de hasta 2 hectáreas.</p>
          </div>

          <div class="tier-price-box">
            <span class="currency">$</span>
            <span class="price-val">29</span>
            <span class="period">USD / MES</span>
          </div>
          <span class="install-tag">INSTALACIÓN INICIAL SEGÚN SENSORES</span>

          <ul class="tier-features">
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Hasta 2 Hectáreas monitoreadas</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>2 Sensores de Suelo SoilSense Pro</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>1 Electroválvula HydroValve 24V</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Agente Hydro en Modo Asesor (App)</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Alertas de helada y sequía por WhatsApp</span></li>
          </ul>

          <button class="btn btn-secondary btn-plan" @click="goToContact('Plan Semilla')">
            <span>SELECCIONAR PLAN</span>
            <ArrowUpRight :size="14" />
          </button>
        </div>

        <!-- Tier 2: Finca Productiva (Signature Aurora Button) -->
        <div class="gaia-card pricing-card tier-featured">
          <div class="tier-header">
            <span class="tier-eyebrow highlight-mist">MÁS POPULAR • MEDIANA ESCALA</span>
            <h3 class="tier-name">Finca Productiva</h3>
            <p class="tier-desc">De 3 a 50 hectáreas. Automatización cerrada de riego y plagas.</p>
          </div>

          <div class="tier-price-box">
            <span class="currency">$</span>
            <span class="price-val">89</span>
            <span class="period">USD / MES BASE</span>
          </div>
          <span class="install-tag">+ $12 USD/HA ADICIONAL • HARDWARE A MEDIDA</span>

          <ul class="tier-features">
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Hasta 50 Hectáreas con sectores divididos</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Sensores LoRaWAN multi-profundidad</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>GaIA Brain Edge Hub (Opera offline)</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Riego 100% Autónomo con Agente Hydro</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Agente Sentinel (Predicción de plagas)</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Soporte técnico y mantenimiento semestral</span></li>
          </ul>

          <button class="btn btn-primary btn-plan" @click="goToContact('Finca Productiva')">
            <span>INICIAR FINCA PRODUCTIVA</span>
            <ArrowUpRight :size="14" />
          </button>
        </div>

        <!-- Tier 3: Enterprise -->
        <div class="gaia-card pricing-card">
          <div class="tier-header">
            <span class="tier-eyebrow">AGRO-INDUSTRIA</span>
            <h3 class="tier-name">GaIA Enterprise</h3>
            <p class="tier-desc">Grandes extensiones, flotas de drones y modelos de IA personalizados.</p>
          </div>

          <div class="tier-price-box">
            <span class="price-val custom-price">A Medida</span>
          </div>
          <span class="install-tag">TARIFAS POR VOLUMEN + SLA 99.9%</span>

          <ul class="tier-features">
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Hectáreas ilimitadas con topografía 3D</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Flotilla de Drones AeroScout X4 autónomos</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Cámaras multiespectrales NDVI & NDRE</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Modelos de IA entrenados para tu cultivo</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Ingeniero agrónomo dedicado & soporte 24/7</span></li>
            <li><span class="bullet-check"><Check :size="12" /></span> <span>Sustitución exprés de hardware en campo</span></li>
          </ul>

          <button class="btn btn-secondary btn-plan" @click="goToContact('GaIA Enterprise')">
            <span>COTIZAR ENTERPRISE</span>
            <ArrowUpRight :size="14" />
          </button>
        </div>
      </div>

      <!-- Recessed Interactive Hectare & ROI Calculator (#011d1c Liquid Deep) -->
      <div class="recessed-card calculator-box mt-5">
        <div class="calc-header">
          <span class="section-eyebrow">HERRAMIENTA FINANCIERA</span>
          <h3 class="calc-heading">Calculadora Interactiva de Inversión & Retorno</h3>
          <p class="calc-sub">Simula las características de tu predio y proyecta el ROI en meses:</p>
        </div>

        <div class="calc-grid">
          <!-- Left Controls -->
          <div class="calc-controls">
            <!-- Hectares Slider -->
            <div class="calc-field">
              <div class="calc-field-top">
                <label class="calc-label">TAMAÑO DEL CULTIVO:</label>
                <span class="calc-val-highlight">{{ hectares }} HA</span>
              </div>
              <input 
                v-model.number="hectares" 
                type="range" 
                min="1" 
                max="100" 
                class="range-slider"
              />
              <div class="calc-ticks">
                <span>1 HA</span>
                <span>25 HA</span>
                <span>50 HA</span>
                <span>100 HA</span>
              </div>
            </div>

            <!-- Crop Type Selector -->
            <div class="calc-field">
              <label class="calc-label">VARIEDAD AGRÍCOLA:</label>
              <select v-model="cropType" class="form-control">
                <option value="aguacate">Aguacate Hass (Alto requerimiento hídrico)</option>
                <option value="cafe">Café Especial (Manejo de roya y floración)</option>
                <option value="citricos">Cítricos (Limón Tahití / Naranja)</option>
                <option value="maiz">Maíz y Granos (Riego por pulsos)</option>
                <option value="hortalizas">Hortalizas e Invernaderos</option>
              </select>
            </div>

            <!-- Drone Addon Checkbox -->
            <label class="drone-addon-toggle">
              <input v-model="requiresDrones" type="checkbox" />
              <div>
                <strong class="toggle-title">INCLUIR DRON AUTÓNOMO AEROSCOUT X4 (+ NDVI)</strong>
                <p class="toggle-sub">Monitoreo multiespectral aéreo y microaspersión focalizada.</p>
              </div>
            </label>
          </div>

          <!-- Right Estimated Results with Auros Typography -->
          <div class="calc-results">
            <div class="result-tile">
              <span class="tile-label">COSTO INICIAL ESTIMADO DE INSTALACIÓN:</span>
              <span class="tile-val">${{ estimatedInitialInstall.toLocaleString() }} USD</span>
              <span class="tile-sub">Hardware certificado + levantamiento técnico en terreno</span>
            </div>

            <div class="result-tile highlight-tile">
              <span class="tile-label">SUSCRIPCIÓN MENSUAL ESTIMADA:</span>
              <span class="tile-val stat-pink">${{ estimatedMonthlySubscription }} USD / MES</span>
              <span class="tile-sub">Plataforma GaIA, agentes de IA, telemetría y soporte continuo</span>
            </div>

            <div class="result-tile">
              <span class="tile-label">AHORRO ECONÓMICO ANUAL PROYECTADO:</span>
              <span class="tile-val text-mist">${{ estimatedAnnualSavings.toLocaleString() }} USD / AÑO</span>
              <span class="tile-sub">En volumen de bombeo eléctrico y reducción de agroquímicos</span>
            </div>

            <div class="roi-banner">
              <span class="roi-label">RECUPERACIÓN DE INVERSIÓN (ROI):</span>
              <span class="roi-stat">{{ estimatedRoiMonths }} MESES</span>
            </div>

            <button class="btn btn-primary btn-calc-quote" @click="goToContact('Calculadora Custom')">
              <span>SOLICITAR PROPUESTA TÉCNICA</span>
              <ArrowUpRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  position: relative;
  background-color: var(--color-liquid-abyss);
}

.pricing-cards-grid {
  align-items: stretch;
  gap: var(--element-gap);
}

.pricing-card {
  display: flex;
  flex-direction: column;
  padding: var(--card-padding);
}

.tier-featured {
  background: #00403c;
  border: 1px solid rgba(203, 255, 252, 0.2);
}

.tier-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.highlight-mist {
  color: var(--color-liquid-mist);
}

.tier-name {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.48px;
  margin: var(--spacing-12) 0 var(--spacing-16) 0;
  color: var(--color-platinum);
}

.tier-desc {
  font-size: 14px;
  color: var(--color-silver-mist);
  line-height: 1.4;
  margin-bottom: var(--spacing-24);
  min-height: 40px;
}

.tier-price-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.currency {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}

.price-val {
  font-size: 48px;
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: -1.5px;
  color: var(--color-lavender-phosphor);
}

.custom-price {
  font-size: 32px;
}

.period {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.install-tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  display: block;
  margin-bottom: var(--spacing-28);
}

.tier-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: var(--spacing-32);
  flex: 1;
}

.tier-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-silver-mist);
}

.bullet-check {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: rgba(3, 81, 75, 0.6);
  color: var(--color-liquid-mist);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.btn-plan {
  width: 100%;
}

.mt-5 {
  margin-top: var(--spacing-48);
}

/* Calculator Box in Liquid Deep (#011d1c) */
.calculator-box {
  background: var(--color-liquid-deep);
  border-radius: var(--radius-cards);
  padding: var(--spacing-48);
}

.calc-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto var(--spacing-36) auto;
}

.calc-heading {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin-bottom: 0.4rem;
}

.calc-sub {
  font-size: 15px;
  color: var(--color-silver-mist);
}

.calc-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--spacing-36);
}

@media (max-width: 860px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }
}

.calc-field {
  margin-bottom: var(--spacing-24);
}

.calc-field-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calc-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.calc-val-highlight {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}

.calc-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--color-slate-deep);
  margin-top: 6px;
}

.drone-addon-toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-small);
  padding: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.toggle-title {
  display: block;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-platinum);
  margin-bottom: 2px;
}

.toggle-sub {
  font-size: 12px;
  color: var(--color-silver-mist);
  margin: 0;
}

/* Results */
.calc-results {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-16);
}

.result-tile {
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-small);
  padding: var(--spacing-16) var(--spacing-20);
}

.tile-label {
  display: block;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  margin-bottom: 4px;
}

.tile-val {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.48px;
  color: var(--color-platinum);
}

.stat-pink {
  color: var(--color-lavender-phosphor);
}

.text-mist {
  color: var(--color-liquid-mist);
}

.tile-sub {
  display: block;
  font-size: 11px;
  color: var(--color-silver-mist);
  margin-top: 2px;
}

.roi-banner {
  background: rgba(0, 130, 124, 0.2);
  border: 1px solid rgba(203, 255, 252, 0.2);
  border-radius: var(--radius-small);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.roi-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
}

.roi-stat {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}

.btn-calc-quote {
  width: 100%;
}
</style>
