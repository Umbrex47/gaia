<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';

const features = [
  {
    badge: 'AGENTE HYDRO',
    title: 'Riego Autónomo por Demanda Radicular',
    desc: 'Calcula la curva de retención hídrica del suelo y la evapotranspiración en tiempo real. Abre y cierra electroválvulas por pulsos milimétricos, optimizando hasta un 45% del recurso hídrico.',
    tags: ['EVAPOTRANSPIRACIÓN ETO', 'PULSOS LORA', 'SIN ENCHARCAMIENTO']
  },
  {
    badge: 'AGENTE SENTINEL',
    title: 'Detección Fitosanitaria Subclínica',
    desc: 'Analiza mapas de reflectancia multiespectral (NDVI y NDRE) para detectar ataques de hongos, roya o insectos hasta 14 días antes de que sean perceptibles al ojo humano.',
    tags: ['VISIÓN COMPUTACIONAL', 'REFLECTANCIA NDVI', 'ALERTA TEMPRANA']
  },
  {
    badge: 'ROBÓTICA AÉREA',
    title: 'Drones Autónomos GaIA AeroScout X4',
    desc: 'Misiones de vuelo automatizadas sin requerir piloto en tierra. Al detectar un foco infeccioso, el dron despega desde su base y aplica bio-repelente con precisión centimétrica.',
    tags: ['RTK CENTIMÉTRICO', 'ASPERSIÓN 16L', 'VUELO POR WAYPOINTS']
  },
  {
    badge: 'EDGE AI HUB',
    title: 'Inteligencia de Borde: 100% Offline',
    desc: 'El GaIA Brain Hub procesa modelos neuronales localmente con NPU de 6 TOPS. La red LoRaWAN privada de 15 km mantiene comunicados sensores y válvulas en cualquier cañón rural sin internet.',
    tags: ['LORAWAN 915MHZ', 'NPU 6 TOPS', 'EDGE COMPUTING']
  },
  {
    badge: 'CONTROL HUMANO',
    title: 'Autonomía Ajustable por el Productor',
    desc: 'Tú estableces los parámetros de control: activa el modo Asesor para recibir solo sugerencias por WhatsApp/App, el modo Supervisado o el modo 100% Autónomo con ejecución directa.',
    tags: ['3 NIVELES DE CONTROL', 'PARÁMETROS SEGUROS', 'TRAZABILIDAD']
  },
  {
    badge: 'SOPORTE AGRO',
    title: 'Modelos Personalizados & Respaldo',
    desc: 'Nuestros ingenieros agrónomos entrenan modelos de IA específicos para tu variedad de cultivo (café, aguacate, cítricos, caña, hortalizas), adaptando las decisiones año tras año.',
    tags: ['ENTRENAMIENTO LOCAL', 'GARANTÍA 12M', 'MANTENIMIENTO']
  }
];
</script>

<template>
  <section id="features" class="section features-section">
    <div class="container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">
          INSTRUMENTACIÓN & CAPACIDADES
        </span>
        <h2 class="section-title">Ecosistema de Automatización Agrícola</h2>
        <p class="section-subtitle">
          Agentes de software de borde trabajando en armonía para maximizar rendimientos, reducir costos de insumos y blindar tu cosecha.
        </p>
      </div>

      <div class="grid-3 features-grid">
        <!-- Feature Surface Card in #003734, 16px radius, no shadow -->
        <div 
          v-for="(f, idx) in features" 
          :key="idx" 
          class="gaia-card feature-card"
        >
          <div class="feature-card-header">
            <span class="feature-badge">{{ f.badge }}</span>
            <div class="btn-arrow-icon" aria-hidden="true">
              <ArrowUpRight :size="16" />
            </div>
          </div>

          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>

          <div class="feature-tags-wrap">
            <span v-for="tag in f.tags" :key="tag" class="feature-tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  position: relative;
  background-color: var(--color-liquid-abyss);
}

.features-grid {
  gap: var(--element-gap);
}

.feature-card {
  display: flex;
  flex-direction: column;
  padding: var(--card-padding);
}

.feature-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-20);
}

.feature-badge {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
}

.feature-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: var(--spacing-16);
  color: var(--color-platinum);
  letter-spacing: -0.4px;
}

.feature-desc {
  font-size: 15px;
  line-height: 1.4;
  color: var(--color-silver-mist);
  margin-bottom: var(--spacing-24);
  flex: 1;
}

.feature-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: var(--spacing-16);
}

.feature-tag {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-silver-mist);
  background: rgba(1, 29, 28, 0.7);
  padding: 3px 7px;
  border-radius: 4px;
}
</style>
