<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { 
  Cpu, Droplets, Sun, Bug, Activity, 
  Wind, Shield, Radio, Check, ShoppingCart, 
  Zap, Plane, CheckCircle2, ArrowUpRight 
} from 'lucide-vue-next';
import { useSimulatorStore } from '../../stores/simulator';
import { useCartStore } from '../../stores/cart';

const simulatorStore = useSimulatorStore();
const cartStore = useCartStore();

const kitAddedNotification = ref(false);

onMounted(() => {
  simulatorStore.fetchState();
});

function handleMoistureChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  simulatorStore.updateVariables({ soilMoisture: val });
}

function handleTempChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  simulatorStore.updateVariables({ temperature: val });
}

function handlePestChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  simulatorStore.updateVariables({ pestPressure: val });
}

function handleAddKitToCart() {
  const count = simulatorStore.addCurrentHardwareToCart();
  if (count > 0) {
    kitAddedNotification.value = true;
    setTimeout(() => {
      kitAddedNotification.value = false;
    }, 3500);
  }
}

const soilColor = computed(() => {
  const m = simulatorStore.state.soilMoisture;
  if (m < 20) return '#03201d';
  if (m < 35) return '#012825';
  if (m < 70) return '#011c1a';
  return '#001413';
});

const plantVigorScale = computed(() => {
  const health = simulatorStore.state.cropHealthScore;
  return Math.max(0.6, health / 100);
});
</script>

<template>
  <div class="simulator-wrapper">
    <!-- Top Action Bar -->
    <div class="sim-top-bar">
      <div class="sim-title-group">
        <div class="sim-live-indicator">
          <span class="pulse-dot"></span>
          <span>TERMINAL DE BORDE EN VIVO</span>
        </div>
        <h2 class="sim-heading">Laboratorio Virtual de Cultivo Autónomo</h2>
      </div>

      <!-- Presets Toolbar (6px radius chips) -->
      <div class="presets-toolbar">
        <span class="presets-label">ESCENARIOS:</span>
        <button 
          class="preset-chip" 
          :class="{ active: simulatorStore.state.weatherPreset === 'optimal' }"
          @click="simulatorStore.applyPreset('optimal')"
        >
          ÓPTIMO
        </button>
        <button 
          class="preset-chip" 
          :class="{ active: simulatorStore.state.weatherPreset === 'drought' }"
          @click="simulatorStore.applyPreset('drought')"
        >
          SEQUÍA
        </button>
        <button 
          class="preset-chip" 
          :class="{ active: simulatorStore.state.weatherPreset === 'heatwave' }"
          @click="simulatorStore.applyPreset('heatwave')"
        >
          OLA CALOR
        </button>
        <button 
          class="preset-chip" 
          :class="{ active: simulatorStore.state.weatherPreset === 'torrential_rain' }"
          @click="simulatorStore.applyPreset('torrential_rain')"
        >
          LLUVIA
        </button>
        <button 
          class="preset-chip" 
          :class="{ active: simulatorStore.state.weatherPreset === 'frost' }"
          @click="simulatorStore.applyPreset('frost')"
        >
          HELADA
        </button>
      </div>
    </div>

    <!-- Main Simulator 3-Column Layout -->
    <div class="simulator-layout">
      <!-- 1. LEFT PANEL: Hardware Component Tray (#003734 Liquid Kelp, 16px radius, no shadow) -->
      <aside class="hardware-tray gaia-card">
        <div class="panel-header">
          <span class="panel-eyebrow">EQUIPOS CONECTADOS</span>
          <h3>Hardware en el Lote</h3>
        </div>
        <p class="panel-sub">Haz clic para vincular o retirar componentes de tu red LoRaWAN:</p>

        <div class="hw-component-list">
          <!-- SoilSense Probe -->
          <div 
            class="hw-toggle-card" 
            :class="{ active: simulatorStore.state.installedHardware.sensor }"
            @click="simulatorStore.toggleHardware('sensor')"
          >
            <div class="hw-icon-box">
              <Activity :size="16" />
            </div>
            <div class="hw-info">
              <p class="hw-name">SoilSense Pro (Sensor)</p>
              <span class="hw-status">
                {{ simulatorStore.state.installedHardware.sensor ? 'CONECTADO (LORAWAN)' : 'DESCONECTADO' }}
              </span>
            </div>
            <div class="hw-check-circle">
              <Check v-if="simulatorStore.state.installedHardware.sensor" :size="12" />
            </div>
          </div>

          <!-- HydroValve 24V -->
          <div 
            class="hw-toggle-card" 
            :class="{ active: simulatorStore.state.installedHardware.valve }"
            @click="simulatorStore.toggleHardware('valve')"
          >
            <div class="hw-icon-box">
              <Droplets :size="16" />
            </div>
            <div class="hw-info">
              <p class="hw-name">HydroValve 24V (Válvula)</p>
              <span class="hw-status">
                {{ simulatorStore.state.installedHardware.valve ? (simulatorStore.state.actuators.valveOpen ? 'REGANDO (ABIERTA)' : 'EN ESPERA (CERRADA)') : 'DESCONECTADA' }}
              </span>
            </div>
            <div class="hw-check-circle">
              <Check v-if="simulatorStore.state.installedHardware.valve" :size="12" />
            </div>
          </div>

          <!-- AeroScout X4 Drone -->
          <div 
            class="hw-toggle-card" 
            :class="{ active: simulatorStore.state.installedHardware.drone }"
            @click="simulatorStore.toggleHardware('drone')"
          >
            <div class="hw-icon-box">
              <Plane :size="16" />
            </div>
            <div class="hw-info">
              <p class="hw-name">AeroScout X4 (Dron IA)</p>
              <span class="hw-status">
                {{ simulatorStore.state.installedHardware.drone ? (simulatorStore.state.actuators.droneFlying ? 'EN VUELO NDVI' : 'EN ESTACIÓN DOCK') : 'NO INSTALADO' }}
              </span>
            </div>
            <div class="hw-check-circle">
              <Check v-if="simulatorStore.state.installedHardware.drone" :size="12" />
            </div>
          </div>

          <!-- MeteoStation 4G -->
          <div 
            class="hw-toggle-card" 
            :class="{ active: simulatorStore.state.installedHardware.meteo }"
            @click="simulatorStore.toggleHardware('meteo')"
          >
            <div class="hw-icon-box">
              <Wind :size="16" />
            </div>
            <div class="hw-info">
              <p class="hw-name">MeteoStation 4G</p>
              <span class="hw-status">
                {{ simulatorStore.state.installedHardware.meteo ? 'MONITOREANDO VIENTO/UV' : 'DESCONECTADA' }}
              </span>
            </div>
            <div class="hw-check-circle">
              <Check v-if="simulatorStore.state.installedHardware.meteo" :size="12" />
            </div>
          </div>

          <!-- GaIA Brain Edge Hub -->
          <div 
            class="hw-toggle-card" 
            :class="{ active: simulatorStore.state.installedHardware.hub }"
            @click="simulatorStore.toggleHardware('hub')"
          >
            <div class="hw-icon-box">
              <Radio :size="16" />
            </div>
            <div class="hw-info">
              <p class="hw-name">GaIA Brain Edge Hub</p>
              <span class="hw-status">
                {{ simulatorStore.state.installedHardware.hub ? 'NPU 6 TOPS ONLINE' : 'APAGADO' }}
              </span>
            </div>
            <div class="hw-check-circle">
              <Check v-if="simulatorStore.state.installedHardware.hub" :size="12" />
            </div>
          </div>
        </div>

        <!-- Add Simulated Setup to Cart CTA -->
        <div class="cart-kit-box">
          <button class="btn btn-primary btn-aurora btn-kit-buy" @click="handleAddKitToCart">
            <span>COMPRAR ESTE SETUP ({{ simulatorStore.activeHardwareCount }})</span>
            <ArrowUpRight :size="14" />
          </button>
          <p v-if="kitAddedNotification" class="kit-notification">
            <CheckCircle2 :size="14" /> Hardware transferido al carrito.
          </p>
        </div>
      </aside>

      <!-- 2. CENTER PANEL: Virtual Crop Field Canvas -->
      <main class="crop-canvas-wrapper gaia-card">
        <!-- Crop Telemetry HUD Overlay -->
        <div class="canvas-hud">
          <div class="hud-stat">
            <span class="hud-label">SALUD DEL CULTIVO:</span>
            <span class="health-val-display">{{ simulatorStore.state.cropHealthScore }}%</span>
          </div>

          <div class="hud-stat">
            <span class="hud-label">AGUA DOSIFICADA:</span>
            <span class="hud-value">{{ simulatorStore.state.actuators.lastWaterLiters }} L</span>
          </div>

          <div class="hud-stat">
            <span class="hud-label">MODO DELEGADO:</span>
            <span class="hud-badge">{{ simulatorStore.state.autonomyLevel.toUpperCase() }}</span>
          </div>
        </div>

        <!-- Visual Interactive Farm Field Canvas -->
        <div class="virtual-field-scene" :style="{ backgroundColor: soilColor }">
          <!-- Atmosphere Overlay -->
          <div class="atmosphere-layer" :class="simulatorStore.state.weatherPreset">
            <div v-if="simulatorStore.state.weatherPreset === 'torrential_rain'" class="rain-animation"></div>
            <div v-if="simulatorStore.state.weatherPreset === 'heatwave'" class="heat-animation"></div>
          </div>

          <!-- Flying Drone Sprite when flying -->
          <div 
            v-if="simulatorStore.state.installedHardware.drone && simulatorStore.state.actuators.droneFlying" 
            class="flying-drone-sprite"
          >
            <div class="drone-body">
              <Plane :size="24" class="drone-icon" />
              <div class="spray-cloud"></div>
            </div>
            <span class="drone-tag">AEROSCOUT X4: ASPERSIÓN BIOLÓGICA</span>
          </div>

          <!-- Virtual Crop Rows -->
          <div class="crop-rows-grid">
            <div v-for="row in 3" :key="row" class="crop-row">
              <div class="furrow-trench"></div>
              
              <!-- Plants in the row -->
              <div class="plants-cluster">
                <div 
                  v-for="p in 6" 
                  :key="p" 
                  class="plant-sprite" 
                  :style="{ transform: `scale(${plantVigorScale})` }"
                >
                  <svg viewBox="0 0 40 50" class="plant-svg">
                    <path d="M 20 48 L 20 20" stroke="#00827c" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M 20 34 C 10 30 6 18 18 14 C 18 24 16 32 20 34 Z" fill="#00a89f"/>
                    <path d="M 20 28 C 30 24 34 12 22 8 C 22 18 24 26 20 28 Z" fill="#00827c"/>
                    <path d="M 20 18 C 14 10 20 2 20 2 C 20 2 26 10 20 18 Z" fill="#cbfffc"/>
                  </svg>
                </div>
              </div>

              <!-- Installed Hardware Visuals inside field -->
              <!-- Valve in Row 1 -->
              <div 
                v-if="row === 1 && simulatorStore.state.installedHardware.valve" 
                class="field-hardware-marker valve-marker"
              >
                <div class="marker-box" :class="{ 'valve-active': simulatorStore.state.actuators.valveOpen }">
                  <Droplets :size="14" />
                </div>
                <div v-if="simulatorStore.state.actuators.valveOpen" class="water-spray-particles"></div>
                <span class="marker-caption">HYDROVALVE 24V</span>
              </div>

              <!-- Soil Sensor Probe in Row 2 -->
              <div 
                v-if="row === 2 && simulatorStore.state.installedHardware.sensor" 
                class="field-hardware-marker sensor-marker"
              >
                <div class="marker-box sensor-box">
                  <Activity :size="14" />
                  <span class="sensor-beacon"></span>
                </div>
                <span class="marker-caption">SOILSENSE ({{ simulatorStore.state.soilMoisture }}% VWC)</span>
              </div>

              <!-- Meteo Station in Row 3 -->
              <div 
                v-if="row === 3 && simulatorStore.state.installedHardware.meteo" 
                class="field-hardware-marker meteo-marker"
              >
                <div class="marker-box meteo-box">
                  <Wind :size="14" />
                </div>
                <span class="marker-caption">METEOSTATION</span>
              </div>
            </div>
          </div>

          <!-- Pest Swarm Visual indicator -->
          <div 
            v-if="simulatorStore.state.pestPressure > 20" 
            class="pest-swarm-layer"
            :style="{ opacity: simulatorStore.state.pestPressure / 100 }"
          >
            <div v-for="b in 8" :key="b" class="bug-particle">
              <Bug :size="12" />
            </div>
          </div>
        </div>

        <!-- Real-Time AI Agent Terminal Log -->
        <div class="action-terminal">
          <div class="terminal-header">
            <Radio :size="12" class="text-mist" />
            <span>CONSOLA DE INFERENCIA DE AGENTES GAIA</span>
          </div>
          <div class="terminal-logs">
            <div 
              v-for="log in simulatorStore.state.eventLogs" 
              :key="log.id" 
              class="terminal-log-row"
              :class="`log-${log.type}`"
            >
              <span class="log-time">[{{ log.timestamp }}]</span>
              <span class="log-agent">[{{ log.agent }}]:</span>
              <span class="log-msg">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </main>

      <!-- 3. RIGHT PANEL: Variable Controls & Delegation Slider -->
      <aside class="variable-controls gaia-card">
        <div class="panel-header">
          <span class="panel-eyebrow">VARIABLES FÍSICAS</span>
          <h3>Control de Entorno</h3>
        </div>
        <p class="panel-sub">Altera los parámetros físicos y observa la toma de decisiones autónoma:</p>

        <!-- Moisture Slider -->
        <div class="control-slider-group">
          <div class="control-slider-header">
            <span class="control-title">HUMEDAD DEL SUELO</span>
            <span class="control-val">{{ simulatorStore.state.soilMoisture }}% VWC</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="95" 
            :value="simulatorStore.state.soilMoisture" 
            class="range-slider"
            @input="handleMoistureChange"
          />
          <div class="slider-ticks">
            <span>&lt;20% SECO</span>
            <span>35-50% ÓPTIMO</span>
            <span>&gt;75% SATURADO</span>
          </div>
        </div>

        <!-- Temperature Slider -->
        <div class="control-slider-group">
          <div class="control-slider-header">
            <span class="control-title">TEMPERATURA AMBIENTE</span>
            <span class="control-val">{{ simulatorStore.state.temperature }} °C</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="45" 
            :value="simulatorStore.state.temperature" 
            class="range-slider"
            @input="handleTempChange"
          />
          <div class="slider-ticks">
            <span>5°C</span>
            <span>24°C</span>
            <span>45°C</span>
          </div>
        </div>

        <!-- Pest Pressure Slider -->
        <div class="control-slider-group">
          <div class="control-slider-header">
            <span class="control-title">PRESIÓN FITOSANITARIA</span>
            <span class="control-val">{{ simulatorStore.state.pestPressure }}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            :value="simulatorStore.state.pestPressure" 
            class="range-slider"
            @input="handlePestChange"
          />
          <div class="slider-ticks">
            <span>0% SANO</span>
            <span>&gt;35% ALERTA</span>
            <span>100% BROTE</span>
          </div>
        </div>

        <!-- Autonomy Delegation Mode -->
        <div class="autonomy-selector-box">
          <span class="panel-eyebrow">DELEGACIÓN DE CONTROL</span>
          <p class="autonomy-desc">Tú defines el nivel de autoridad concedido al software:</p>

          <div class="autonomy-options">
            <label 
              class="autonomy-radio-card"
              :class="{ selected: simulatorStore.state.autonomyLevel === 'advisory' }"
            >
              <input 
                type="radio" 
                name="autonomy" 
                value="advisory" 
                :checked="simulatorStore.state.autonomyLevel === 'advisory'"
                @change="simulatorStore.setAutonomyLevel('advisory')"
              />
              <div>
                <strong>MODO ASESOR</strong>
                <p>Solo recomendaciones a la app. No acciona válvulas sin tu confirmación.</p>
              </div>
            </label>

            <label 
              class="autonomy-radio-card"
              :class="{ selected: simulatorStore.state.autonomyLevel === 'supervised' }"
            >
              <input 
                type="radio" 
                name="autonomy" 
                value="supervised" 
                :checked="simulatorStore.state.autonomyLevel === 'supervised'"
                @change="simulatorStore.setAutonomyLevel('supervised')"
              />
              <div>
                <strong>MODO SUPERVISADO</strong>
                <p>Riego rutinario autónomo; solicita aprobación para dosis críticas.</p>
              </div>
            </label>

            <label 
              class="autonomy-radio-card"
              :class="{ selected: simulatorStore.state.autonomyLevel === 'autonomous' }"
            >
              <input 
                type="radio" 
                name="autonomy" 
                value="autonomous" 
                :checked="simulatorStore.state.autonomyLevel === 'autonomous'"
                @change="simulatorStore.setAutonomyLevel('autonomous')"
              />
              <div>
                <strong>100% AUTÓNOMO</strong>
                <p>Monitoreo, riego y vuelo de dron sin intervención humana en bucle cerrado.</p>
              </div>
            </label>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.simulator-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
}

.sim-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-liquid-kelp);
  border-radius: var(--radius-cards);
  padding: var(--spacing-20) var(--spacing-28);
  flex-wrap: wrap;
  gap: 1.25rem;
}

.sim-live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  font-weight: 500;
  color: var(--color-liquid-mist);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-aurora-gradient);
}

.sim-heading {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4px;
  margin: 0;
}

.presets-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.preset-chip {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-silver-mist);
  padding: 6px 12px;
  border-radius: var(--radius-buttons);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preset-chip:hover, .preset-chip.active {
  background: rgba(3, 81, 75, 0.6);
  border-color: var(--color-liquid-mist);
  color: var(--color-platinum);
}

/* Layout */
.simulator-layout {
  display: grid;
  gap: var(--element-gap);
}

.panel-eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
  display: block;
  margin-bottom: 4px;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.3px;
  margin: 0;
}

.panel-sub {
  font-size: 13px;
  color: var(--color-silver-mist);
  margin-top: 4px;
  margin-bottom: var(--spacing-20);
}

/* Hardware Tray */
.hw-component-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: var(--spacing-24);
}

.hw-toggle-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 10px 14px;
  background: var(--color-liquid-deep);
  border-radius: var(--radius-small);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.hw-toggle-card:hover {
  background: #012a28;
}

.hw-toggle-card.active {
  border-color: rgba(203, 255, 252, 0.25);
  background: #004642;
}

.hw-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: rgba(3, 81, 75, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-silver-mist);
}

.hw-toggle-card.active .hw-icon-box {
  color: var(--color-liquid-mist);
}

.hw-info {
  flex: 1;
}

.hw-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-platinum);
  margin: 0;
}

.hw-status {
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-slate-deep);
}

.hw-toggle-card.active .hw-status {
  color: var(--color-liquid-mist);
}

.hw-check-circle {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-liquid-mist);
}

.hw-toggle-card.active .hw-check-circle {
  background: var(--color-liquid-mist);
  color: #012624;
}

.cart-kit-box {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: var(--spacing-16);
}

.btn-kit-buy {
  width: 100%;
}

.kit-notification {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 11px;
  color: var(--color-liquid-mist);
  margin-top: 8px;
  justify-content: center;
}

/* Center Field Canvas */
.crop-canvas-wrapper {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-20);
  gap: var(--spacing-16);
}

.canvas-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-liquid-deep);
  border-radius: var(--radius-small);
  padding: 10px 16px;
  flex-wrap: wrap;
  gap: 1rem;
}

.hud-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hud-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.health-val-display {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-lavender-phosphor);
}

.hud-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-platinum);
}

.hud-badge {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
  background: rgba(3, 81, 75, 0.6);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Virtual Field Scene */
.virtual-field-scene {
  height: 380px;
  border-radius: var(--radius-small);
  position: relative;
  overflow: hidden;
  transition: background-color 0.8s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 1.5rem 1rem;
}

.atmosphere-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* Flying Drone */
.flying-drone-sprite {
  position: absolute;
  top: 15%;
  left: 20%;
  animation: dronePatrol 8s ease-in-out infinite alternate;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes dronePatrol {
  0% { transform: translate(0, 0); }
  50% { transform: translate(220px, 20px); }
  100% { transform: translate(440px, 0); }
}

.drone-body {
  position: relative;
  background: var(--color-liquid-deep);
  border: 1px solid var(--color-liquid-mist);
  border-radius: 50%;
  padding: 6px;
  color: var(--color-liquid-mist);
}

.spray-cloud {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 25px;
  background: radial-gradient(circle, rgba(203, 255, 252, 0.3) 0%, transparent 70%);
}

.drone-tag {
  background: var(--color-liquid-deep);
  color: var(--color-liquid-mist);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  margin-top: 3px;
}

/* Rows */
.crop-rows-grid {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  z-index: 10;
}

.crop-row {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 0;
}

.furrow-trench {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.plants-cluster {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  z-index: 2;
}

.plant-sprite {
  transition: transform 0.5s ease;
}

.plant-svg {
  width: 32px;
  height: 42px;
}

/* Hardware Markers */
.field-hardware-marker {
  position: absolute;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.valve-marker { left: 15%; top: -12px; }
.sensor-marker { left: 55%; top: -10px; }
.meteo-marker { right: 10%; top: -12px; }

.marker-box {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: var(--color-liquid-deep);
  border: 1px solid var(--color-liquid-mist);
  color: var(--color-liquid-mist);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.valve-active {
  background: #00827c;
  color: #ffffff;
}

.water-spray-particles {
  position: absolute;
  top: 100%;
  width: 60px;
  height: 20px;
  background: radial-gradient(circle, rgba(203, 255, 252, 0.5) 0%, transparent 70%);
}

.marker-caption {
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(1, 29, 28, 0.9);
  color: var(--color-silver-mist);
  padding: 1px 4px;
  border-radius: 2px;
  margin-top: 2px;
  white-space: nowrap;
}

.pest-swarm-layer {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  pointer-events: none;
  z-index: 12;
  color: var(--gaia-danger);
}

/* Terminal Log */
.action-terminal {
  background: var(--color-liquid-deep);
  border-radius: var(--radius-small);
  font-family: var(--font-mono);
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.terminal-logs {
  height: 110px;
  overflow-y: auto;
  padding: 8px 12px;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.terminal-log-row {
  display: flex;
  gap: 0.5rem;
  line-height: 1.4;
}

.log-time { color: var(--color-slate-deep); }
.log-agent { color: var(--color-liquid-mist); font-weight: 500; }
.log-action .log-msg { color: var(--color-lavender-phosphor); }
.log-warning .log-msg { color: var(--gaia-warning); }
.log-success .log-msg { color: #a3f7f0; }

/* 3. Variable Controls */
.control-slider-group {
  margin-bottom: var(--spacing-20);
}

.control-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.control-title {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
}

.control-val {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-lavender-phosphor);
  font-weight: 500;
}

.range-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: var(--color-liquid-deep);
  border-radius: 2px;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-liquid-mist);
  cursor: pointer;
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-slate-deep);
  margin-top: 4px;
}

/* Autonomy Selector */
.autonomy-selector-box {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: var(--spacing-16);
  margin-top: var(--spacing-16);
}

.autonomy-desc {
  font-size: 12px;
  color: var(--color-silver-mist);
  margin-bottom: var(--spacing-12);
}

.autonomy-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.autonomy-radio-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 8px 12px;
  background: var(--color-liquid-deep);
  border-radius: var(--radius-small);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.autonomy-radio-card:hover {
  background: #012826;
}

.autonomy-radio-card.selected {
  border-color: rgba(203, 255, 252, 0.25);
  background: #004642;
}

.autonomy-radio-card strong {
  display: block;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-platinum);
}

.autonomy-radio-card p {
  font-size: 11px;
  color: var(--color-silver-mist);
  margin: 0;
  line-height: 1.3;
}
</style>
