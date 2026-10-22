<script setup lang="ts">
const stats = [
  { value: '14,800+', unit: 'HA', label: 'BAJO MONITOREO DE BORDE' },
  { value: '42.4%', unit: '', label: 'AHORRO HÍDRICO RADICULAR' },
  { value: '99.4%', unit: '', label: 'PRECISIÓN FITOSANITARIA NDVI' },
  { value: '5,120+', unit: '', label: 'VUELOS AUTÓNOMOS DE DRON' },
  { value: '100%', unit: '', label: 'ARQUITECTURA HARDWARE ABIERTO' },
];
</script>

<template>
  <div class="ticker-root">
    <div class="container ticker-container">
      <div class="ticker-grid">
        <div v-for="(stat, idx) in stats" :key="idx" class="ticker-stat-item">
          <div class="stat-number-wrap">
            <span class="stat-number">{{ stat.value }}</span>
            <span v-if="stat.unit" class="stat-unit">{{ stat.unit }}</span>
          </div>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker-root {
  background: var(--color-liquid-deep);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: var(--spacing-48) 0;
  position: relative;
  z-index: 10;
}

.ticker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--spacing-24);
  align-items: flex-start;
}

@media (max-width: 1023px) {
  .ticker-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-32);
  }
}

@media (max-width: 639px) {
  .ticker-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-28);
  }
}

.ticker-stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

/* Large numbers in lavender-phosphor pink (#fde9ff) */
.stat-number {
  font-family: var(--font-matter);
  font-size: clamp(2.2rem, 3.2vw, 3.8rem);
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: -2px;
  color: var(--color-lavender-phosphor);
}

.stat-unit {
  font-family: var(--font-matter);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-liquid-mist);
}

/* Label below in mist (#edfffe) or silver at 13px uppercase tracked */
.stat-label {
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-silver-mist);
  margin-top: 8px;
  line-height: 1.35;
}
</style>
