<script setup lang="ts">
import { ref } from 'vue';
import { 
  Mail, Send, CheckCircle2, AlertCircle, 
  MapPin, Phone, Clock, MessageSquare 
} from 'lucide-vue-next';
import { api } from '../../services/api';

const form = ref({
  name: '',
  email: '',
  phone: '',
  farmSize: '10-50 Hectáreas',
  cropType: '',
  message: '',
});

const isSubmitting = ref(false);
const submitted = ref(false);
const errorMessage = ref<string | null>(null);

async function handleSubmit() {
  errorMessage.value = null;

  if (!form.value.name || !form.value.email || !form.value.message) {
    errorMessage.value = 'Por favor completa los campos obligatorios (*).';
    return;
  }

  isSubmitting.value = true;
  try {
    await api.sendContact(form.value);
    submitted.value = true;
    form.value = {
      name: '',
      email: '',
      phone: '',
      farmSize: '10-50 Hectáreas',
      cropType: '',
      message: '',
    };
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al enviar el mensaje. Intenta nuevamente.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section id="contacto" class="section contact-section">
    <div class="container">
      <div class="section-title-wrap">
        <div class="badge-tag">
          <MessageSquare :size="14" /> Comunícate con Nosotros
        </div>
        <h2 class="section-title">Hablemos de tu Proyecto Agrícola</h2>
        <p class="section-subtitle">
          Nuestros agrónomos y especialistas en robótica IoT están listos para analizar tu lote y enviarte un plan de integración a medida.
        </p>
      </div>

      <div class="grid-2 contact-layout">
        <!-- Left: Form -->
        <div class="gaia-card contact-form-card">
          <div v-if="submitted" class="contact-success-state">
            <CheckCircle2 :size="52" class="text-neon" />
            <h3>¡Mensaje Recibido con Éxito!</h3>
            <p>
              Uno de nuestros ingenieros agrónomos revisará los detalles de tu finca y te contactará en menos de 24 horas hábiles.
            </p>
            <button class="btn btn-primary" @click="submitted = false">
              Enviar otra consulta
            </button>
          </div>

          <form v-else @submit.prevent="handleSubmit">
            <div v-if="errorMessage" class="error-banner">
              <AlertCircle :size="16" />
              <span>{{ errorMessage }}</span>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Nombre Completo *</label>
                <input v-model="form.name" type="text" class="form-control" placeholder="Carlos Gómez" required />
              </div>
              <div class="form-group">
                <label class="form-label">Correo Electrónico *</label>
                <input v-model="form.email" type="email" class="form-control" placeholder="carlos@agro.com" required />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Teléfono Móvil / WhatsApp</label>
                <input v-model="form.phone" type="tel" class="form-control" placeholder="+57 300 000 0000" />
              </div>
              <div class="form-group">
                <label class="form-label">Tamaño Aproximado de la Finca</label>
                <select v-model="form.farmSize" class="form-control">
                  <option value="Menos de 2 Hectáreas">&lt; 2 Hectáreas (Parcela familiar)</option>
                  <option value="2 a 10 Hectáreas">2 a 10 Hectáreas</option>
                  <option value="10 a 50 Hectáreas">10 a 50 Hectáreas (Mediana escala)</option>
                  <option value="Más de 50 Hectáreas">&gt; 50 Hectáreas (Gran escala / Agro-industria)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tipo de Cultivo / Variedad</label>
              <input v-model="form.cropType" type="text" class="form-control" placeholder="Ej. Aguacate Hass, Café Castillo, Tomate bajo invernadero" />
            </div>

            <div class="form-group">
              <label class="form-label">¿Qué desafíos deseas resolver con GaIA? *</label>
              <textarea 
                v-model="form.message" 
                rows="4" 
                class="form-control" 
                placeholder="Cuéntanos sobre tu fuente de agua, problemas de plagas o requerimientos de automatización..." 
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-submit" :disabled="isSubmitting">
              <Send :size="18" />
              <span v-if="isSubmitting">Enviando solicitud...</span>
              <span v-else>Enviar Consulta de Campo</span>
            </button>
          </form>
        </div>

        <!-- Right: Contact Coordinates & Offices -->
        <div class="contact-info-col">
          <div class="gaia-card info-card">
            <h3 class="info-card-title">Atención Directa & Demostraciones</h3>
            <p class="info-card-desc">
              Puedes visitarnos en nuestros centros de innovación o agendar un vuelo de prueba de dron en tu propia finca.
            </p>

            <div class="info-points-list">
              <div class="info-point">
                <div class="point-icon"><MapPin :size="20" class="text-neon" /></div>
                <div>
                  <h4 class="point-name">Sede Central y Laboratorio de IA</h4>
                  <p class="point-val">Parque Tecnológico Agroindustrial, Módulo 4B, Rionegro, Colombia</p>
                </div>
              </div>

              <div class="info-point">
                <div class="point-icon"><Phone :size="20" class="text-neon" /></div>
                <div>
                  <h4 class="point-name">Línea de Soporte Técnico Agrícola</h4>
                  <p class="point-val">+57 (300) 800-GAIA (4242) / WhatsApp 24/7</p>
                </div>
              </div>

              <div class="info-point">
                <div class="point-icon"><Mail :size="20" class="text-neon" /></div>
                <div>
                  <h4 class="point-name">Correo Corporativo</h4>
                  <p class="point-val">contacto@gaia-agritech.com / ingenieria@gaia-agritech.com</p>
                </div>
              </div>

              <div class="info-point">
                <div class="point-icon"><Clock :size="20" class="text-neon" /></div>
                <div>
                  <h4 class="point-name">Horario de Mesa de Ayuda</h4>
                  <p class="point-val">Lunes a Sábado: 06:00 AM - 07:00 PM (Hora de Campo)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  position: relative;
}

.contact-layout {
  align-items: stretch;
}

.contact-form-card {
  padding: 2.5rem;
  background: var(--color-liquid-kelp);
  border: none;
  border-radius: var(--radius-card);
  box-shadow: none;
}

.contact-success-state {
  text-align: center;
  padding: 3rem 1rem;
}

.contact-success-state h3 {
  font-family: var(--font-matter);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-platinum);
  margin: 1.25rem 0 0.5rem 0;
}

.contact-success-state p {
  font-family: var(--font-matter);
  color: var(--color-silver-mist);
  font-size: 14px;
  margin-bottom: 2rem;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid var(--gaia-danger);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  margin-bottom: 1.25rem;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 639px) {
  .form-row-2 {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1.2rem;
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

.form-control {
  width: 100%;
  background: var(--color-liquid-deep);
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

.btn-submit {
  width: 100%;
  padding: 12px;
  margin-top: 0.5rem;
  border-radius: var(--radius-button);
  background: var(--color-aurora-gradient);
  color: #012624;
  font-family: var(--font-matter);
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Info Col */
.info-card {
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: var(--color-liquid-deep);
  border: none;
  border-radius: var(--radius-card);
  box-shadow: none;
}

.info-card-title {
  font-family: var(--font-matter);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-platinum);
  margin-bottom: 0.5rem;
}

.info-card-desc {
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-silver-mist);
  line-height: 1.5;
  margin-bottom: 2rem;
}

.info-points-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-point {
  display: flex;
  gap: 1rem;
}

.point-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-liquid-mist);
}

.point-name {
  font-family: var(--font-matter);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-platinum);
  margin-bottom: 0.2rem;
}

.point-val {
  font-family: var(--font-matter);
  font-size: 13px;
  color: var(--color-silver-mist);
  line-height: 1.4;
}
</style>
