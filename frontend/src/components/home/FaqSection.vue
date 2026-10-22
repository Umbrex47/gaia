<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { api } from '../../services/api';
import type { FaqItem } from '../../types';

const faqs = ref<FaqItem[]>([]);
const activeCategory = ref('all');
const openFaqId = ref<string | null>('faq-001');

onMounted(async () => {
  try {
    faqs.value = await api.getFaqs();
  } catch (e) {
    console.warn('Cargando FAQs locales');
  }
});

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') return faqs.value;
  return faqs.value.filter(f => f.category === activeCategory.value);
});

function toggleFaq(id: string) {
  openFaqId.value = openFaqId.value === id ? null : id;
}
</script>

<template>
  <section id="faq" class="section faq-section">
    <div class="container">
      <div class="section-title-wrap">
        <div class="badge-tag">
          <HelpCircle :size="14" /> Preguntas Frecuentes
        </div>
        <h2 class="section-title">Claridad Total para tu Transformación Digital</h2>
        <p class="section-subtitle">
          Resolvemos tus dudas técnicas, operativas y financieras sobre la implementación de GaIA en tu predio.
        </p>
      </div>

      <!-- Categories Pills -->
      <div class="faq-categories-pills">
        <button 
          class="faq-cat-btn" 
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          Todas
        </button>
        <button 
          class="faq-cat-btn" 
          :class="{ active: activeCategory === 'hardware' }"
          @click="activeCategory = 'hardware'"
        >
          Hardware Abierto
        </button>
        <button 
          class="faq-cat-btn" 
          :class="{ active: activeCategory === 'conectividad' }"
          @click="activeCategory = 'conectividad'"
        >
          Sin Internet (Offline)
        </button>
        <button 
          class="faq-cat-btn" 
          :class="{ active: activeCategory === 'ia' }"
          @click="activeCategory = 'ia'"
        >
          Autonomía & IA
        </button>
        <button 
          class="faq-cat-btn" 
          :class="{ active: activeCategory === 'costos' }"
          @click="activeCategory = 'costos'"
        >
          Costos & Garantía
        </button>
      </div>

      <!-- FAQ Accordion List -->
      <div class="faq-accordion-list">
        <div 
          v-for="faq in filteredFaqs" 
          :key="faq.id" 
          class="gaia-card faq-item-card"
          :class="{ expanded: openFaqId === faq.id }"
        >
          <button 
            type="button" 
            class="faq-question-btn" 
            @click="toggleFaq(faq.id)"
            :aria-expanded="openFaqId === faq.id"
          >
            <span class="faq-q-text">{{ faq.question }}</span>
            <div class="faq-chevron-wrap">
              <component :is="openFaqId === faq.id ? ChevronUp : ChevronDown" :size="18" />
            </div>
          </button>

          <Transition name="expand">
            <div v-if="openFaqId === faq.id" class="faq-answer-wrap">
              <p class="faq-answer-text">{{ faq.answer }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  position: relative;
}

.faq-categories-pills {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.faq-cat-btn {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-silver-mist);
  font-family: var(--font-matter);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.faq-cat-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
}

.faq-cat-btn.active {
  background: var(--color-liquid-kelp);
  border-color: rgba(203, 255, 252, 0.4);
  color: var(--color-platinum);
}

.faq-accordion-list {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.faq-item-card {
  padding: 0;
  background: var(--color-liquid-kelp);
  border: none;
  border-radius: var(--radius-card);
  box-shadow: none;
  overflow: hidden;
  transition: background var(--transition-fast);
}

.faq-question-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: none;
  border: none;
  padding: 1.4rem 1.75rem;
  cursor: pointer;
  color: var(--color-platinum);
}

.faq-q-text {
  font-family: var(--font-matter);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
  padding-right: 1rem;
}

.faq-chevron-wrap {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-liquid-mist);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.faq-item-card.expanded .faq-chevron-wrap {
  background: var(--color-aurora-gradient);
  color: #012624;
  border-color: transparent;
}

.faq-answer-wrap {
  padding: 0 1.75rem 1.5rem 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.25rem;
}

.faq-answer-text {
  font-family: var(--font-matter);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-silver-mist);
  line-height: 1.45;
  margin: 0;
}

/* Transitions */
.expand-enter-active, .expand-leave-active {
  transition: all 0.2s ease;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
