<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { 
  MessageSquare, X, Send, Bot, Sparkles, 
  ChevronDown, ChevronUp, Cpu, ShoppingCart, ArrowRight 
} from 'lucide-vue-next';
import { api } from '../../services/api';
import { useCartStore } from '../../stores/cart';
import { useProductsStore } from '../../stores/products';

interface ChatMsg {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  recommendedHardwareIds?: string[];
  timestamp: string;
  showThinking?: boolean;
}

const cartStore = useCartStore();
const productsStore = useProductsStore();

const isOpen = ref(false);
const inputMsg = ref('');
const isThinking = ref(false);
const chatScroll = ref<HTMLElement | null>(null);

const messages = ref<ChatMsg[]>([
  {
    id: 'welcome-1',
    sender: 'assistant',
    content: '¡Hola! Soy el Agente de IA Agronómica de **GaIA** 🌿.\n\nEstoy conectado al motor de inferencia técnica. Puedo ayudarte a dimensionar tu riego por pulsos, calcular dosis de bio-control con drones, o recomendarte el hardware LoRaWAN exacto para tu finca.',
    timestamp: 'Ahora',
  },
]);

const quickPrompts = [
  '¿Cómo calculo el riego para 15 Ha de aguacate?',
  '¿Cómo vuela el dron AeroScout X4 en viento fuerte?',
  '¿Cómo opera GaIA si no tengo internet en la finca?',
  '¿Cuánto cuesta el sistema completo con instalación?',
];

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
}

async function scrollToBottom() {
  await nextTick();
  if (chatScroll.value) {
    chatScroll.value.scrollTop = chatScroll.value.scrollHeight;
  }
}

async function sendQuickPrompt(promptText: string) {
  inputMsg.value = promptText;
  await handleSend();
}

async function handleSend() {
  const text = inputMsg.value.trim();
  if (!text || isThinking.value) return;

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messages.value.push({
    id: `user-${Date.now()}`,
    sender: 'user',
    content: text,
    timestamp: userTime,
  });

  inputMsg.value = '';
  isThinking.value = true;
  await scrollToBottom();

  try {
    const res = await api.sendChatMessage(text, messages.value);
    messages.value.push({
      ...res,
      showThinking: true,
    });
  } catch (e) {
    messages.value.push({
      id: `err-${Date.now()}`,
      sender: 'assistant',
      content: 'Lo siento, hubo un problema al conectar con el agente de IA. Por favor intenta nuevamente.',
      timestamp: 'Ahora',
    });
  } finally {
    isThinking.value = false;
    await scrollToBottom();
  }
}

function getProduct(id: string) {
  return productsStore.products.find(p => p.id === id);
}

function addProductToCart(productId: string) {
  const prod = getProduct(productId);
  if (prod) {
    cartStore.addItem(prod, 1);
  }
}
</script>

<template>
  <div class="chatbot-wrapper">
    <!-- Floating Trigger Button -->
    <button 
      class="chat-launcher-btn" 
      :class="{ active: isOpen }"
      @click="toggleChat" 
      aria-label="Abrir asistente de IA agronómica"
    >
      <Bot v-if="!isOpen" :size="26" />
      <X v-else :size="26" />
      <span v-if="!isOpen" class="launcher-pulse"></span>
    </button>

    <!-- Chat Box Window -->
    <Transition name="chat-pop">
      <div v-if="isOpen" class="chat-window gaia-card">
        <!-- Header -->
        <div class="chat-header">
          <div class="bot-status-wrap">
            <div class="bot-avatar">
              <Bot :size="20" class="text-neon" />
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4 class="bot-title">GaIA Agronomy AI</h4>
              <p class="bot-status-text">Razonamiento agronómico autónomo</p>
            </div>
          </div>
          <button class="chat-close-btn" @click="isOpen = false" aria-label="Cerrar chat">
            <X :size="18" />
          </button>
        </div>

        <!-- Chat History -->
        <div ref="chatScroll" class="chat-messages-container">
          <!-- Quick Prompts (only if few messages) -->
          <div v-if="messages.length <= 2" class="quick-prompts-tray">
            <p class="prompts-title">Preguntas frecuentes al Agente de IA:</p>
            <div class="prompts-grid">
              <button 
                v-for="(qp, idx) in quickPrompts" 
                :key="idx" 
                class="quick-prompt-chip"
                @click="sendQuickPrompt(qp)"
              >
                {{ qp }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div 
            v-for="msg in messages" 
            :key="msg.id" 
            class="chat-bubble-row"
            :class="`msg-${msg.sender}`"
          >
            <div class="bubble-content">
              <!-- Thinking Accordion -->
              <div v-if="msg.thinking && msg.thinking.length > 0" class="thinking-accordion">
                <button 
                  type="button" 
                  class="thinking-toggle-btn" 
                  @click="msg.showThinking = !msg.showThinking"
                >
                  <Sparkles :size="14" class="text-neon" />
                  <span>Razonamiento paso a paso</span>
                  <component :is="msg.showThinking ? ChevronUp : ChevronDown" :size="14" />
                </button>
                <div v-if="msg.showThinking" class="thinking-steps">
                  <div v-for="(step, sIdx) in msg.thinking" :key="sIdx" class="thinking-step-item">
                    {{ step }}
                  </div>
                </div>
              </div>

              <!-- Main Text -->
              <div class="text-content" style="white-space: pre-line;">
                {{ msg.content }}
              </div>

              <!-- Recommended Hardware Cards -->
              <div v-if="msg.recommendedHardwareIds && msg.recommendedHardwareIds.length > 0" class="chat-rec-hardware">
                <span class="rec-title"><Cpu :size="13" /> Equipos sugeridos por el agente:</span>
                <div class="rec-items-row">
                  <div 
                    v-for="hwId in msg.recommendedHardwareIds" 
                    :key="hwId"
                    class="rec-hw-card"
                  >
                    <div v-if="getProduct(hwId)" class="rec-hw-inner">
                      <img :src="getProduct(hwId)?.image" :alt="getProduct(hwId)?.name" class="rec-thumb" />
                      <div class="rec-info">
                        <p class="rec-name">{{ getProduct(hwId)?.name }}</p>
                        <p class="rec-price">${{ getProduct(hwId)?.price.toFixed(2) }} USD</p>
                      </div>
                      <button 
                        class="btn-rec-cart" 
                        @click="addProductToCart(hwId)"
                        title="Agregar al carrito"
                      >
                        <ShoppingCart :size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <span class="msg-timestamp">{{ msg.timestamp }}</span>
            </div>
          </div>

          <!-- Thinking Spinner Animation -->
          <div v-if="isThinking" class="chat-bubble-row msg-assistant">
            <div class="bubble-content thinking-bubble">
              <Sparkles :size="16" class="spin-icon text-neon" />
              <span>GaIA está analizando variables del cultivo...</span>
            </div>
          </div>
        </div>

        <!-- Chat Input Form -->
        <form class="chat-input-bar" @submit.prevent="handleSend">
          <input 
            v-model="inputMsg" 
            type="text" 
            placeholder="Pregunta sobre riego, plagas, sensores o costos..." 
            class="chat-text-input" 
            :disabled="isThinking"
          />
          <button 
            type="submit" 
            class="chat-send-btn" 
            :disabled="!inputMsg.trim() || isThinking"
            aria-label="Enviar mensaje"
          >
            <Send :size="16" />
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 75;
}

@media (max-width: 639px) {
  .chatbot-wrapper {
    bottom: 1.25rem;
    right: 1.25rem;
  }
}

.chat-launcher-btn {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-button);
  background: var(--color-aurora-gradient);
  border: none;
  color: #012624;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: none;
  transition: all var(--transition-fast);
  position: relative;
}

.chat-launcher-btn:hover {
  transform: translateY(-2px);
}

.launcher-pulse {
  position: absolute;
  inset: -3px;
  border-radius: 8px;
  border: 1px solid rgba(203, 255, 252, 0.4);
  animation: pulseOuter 2.5s infinite;
}

@keyframes pulseOuter {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.15); opacity: 0; }
}

/* Chat Window */
.chat-window {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 400px;
  max-width: 92vw;
  height: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-radius: var(--radius-card);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: var(--color-liquid-deep);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--color-liquid-abyss);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.bot-status-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--color-liquid-mist);
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--color-liquid-mist);
  border: 2px solid var(--color-liquid-abyss);
  border-radius: 50%;
}

.bot-title {
  font-family: var(--font-matter);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-platinum);
  margin: 0;
}

.bot-status-text {
  font-family: var(--font-matter);
  font-size: 11px;
  color: var(--color-silver-mist);
  margin: 0;
}

.chat-close-btn {
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-silver-mist);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-button);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.chat-close-btn:hover {
  color: var(--color-platinum);
}

/* Messages */
.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-prompts-tray {
  background: var(--color-liquid-abyss);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding: 0.85rem;
}

.prompts-title {
  font-family: var(--font-matter);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-silver-mist);
  margin-bottom: 0.5rem;
}

.prompts-grid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.quick-prompt-chip {
  text-align: left;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-silver-mist);
  font-family: var(--font-matter);
  font-size: 12px;
  padding: 6px 10px;
  border-radius: var(--radius-button);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-prompt-chip:hover {
  background: var(--color-aurora-gradient);
  color: #012624;
  border-color: transparent;
}

.chat-bubble-row {
  display: flex;
  flex-direction: column;
}

.msg-user {
  align-items: flex-end;
}

.msg-assistant {
  align-items: flex-start;
}

.msg-user .bubble-content {
  background: var(--color-liquid-kelp);
  color: var(--color-platinum);
  border-bottom-right-radius: 2px;
}

.msg-assistant .bubble-content {
  background: var(--color-liquid-abyss);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-silver-mist);
  border-bottom-left-radius: 2px;
}

.bubble-content {
  max-width: 90%;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-family: var(--font-matter);
  font-size: 13px;
  line-height: 1.45;
  position: relative;
}

.thinking-accordion {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-button);
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.75rem;
}

.thinking-toggle-btn {
  background: none;
  border: none;
  color: var(--color-liquid-mist);
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  padding: 0;
}

.thinking-steps {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 11px;
  color: var(--color-silver-mist);
  font-family: monospace;
}

.thinking-step-item {
  line-height: 1.35;
}

.chat-rec-hardware {
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.rec-title {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-matter);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-liquid-mist);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.rec-items-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rec-hw-card {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-button);
  padding: 0.4rem 0.6rem;
}

.rec-hw-inner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.rec-thumb {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.rec-info {
  flex: 1;
}

.rec-name {
  font-family: var(--font-matter);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-platinum);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 170px;
}

.rec-price {
  font-family: var(--font-matter);
  font-size: 11px;
  color: var(--color-lavender-phosphor);
}

.btn-rec-cart {
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-platinum);
  padding: 0.35rem;
  border-radius: var(--radius-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-rec-cart:hover {
  background: var(--color-aurora-gradient);
  color: #012624;
}

.msg-timestamp {
  display: block;
  font-family: var(--font-matter);
  font-size: 10px;
  color: var(--color-silver-mist);
  margin-top: 0.4rem;
  text-align: right;
}

.thinking-bubble {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
}

.spin-icon {
  animation: spin 2s linear infinite;
  color: var(--color-liquid-mist);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Input Bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.25rem;
  background: var(--color-liquid-abyss);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-text-input {
  flex: 1;
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-button);
  padding: 8px 12px;
  color: var(--color-platinum);
  font-family: var(--font-matter);
  font-size: 13px;
  outline: none;
  transition: border-color var(--transition-fast);
}

.chat-text-input:focus {
  border-color: rgba(203, 255, 252, 0.4);
}

.chat-send-btn {
  background: var(--color-aurora-gradient);
  border: none;
  color: #012624;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chat-send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.chat-send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Transitions */
.chat-pop-enter-active, .chat-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-pop-enter-from, .chat-pop-leave-to {
  transform: translateY(16px) scale(0.96);
  opacity: 0;
}
</style>
