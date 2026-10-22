import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SimulatorState } from '../types';
import { api } from '../services/api';
import { useCartStore } from './cart';
import { useProductsStore } from './products';

export const useSimulatorStore = defineStore('simulator', () => {
  const state = ref<SimulatorState>({
    soilMoisture: 42,
    temperature: 24,
    solarRadiation: 550,
    pestPressure: 5,
    cropStage: 'vegetative',
    weatherPreset: 'optimal',
    autonomyLevel: 'autonomous',
    installedHardware: {
      sensor: true,
      valve: true,
      drone: false,
      meteo: true,
      hub: true,
    },
    actuators: {
      valveOpen: false,
      droneFlying: false,
      droneMission: 'idle',
      lastWaterLiters: 0,
    },
    cropHealthScore: 94,
    eventLogs: [],
  });

  const isLoading = ref(false);

  async function fetchState() {
    try {
      const data = await api.getSimulatorState();
      state.value = data;
    } catch (e) {
      console.warn('Usando estado local del simulador');
    }
  }

  async function updateVariables(partial: Partial<SimulatorState>) {
    // Optimistic update
    state.value = {
      ...state.value,
      ...partial,
    };
    try {
      const updated = await api.updateSimulator(partial);
      state.value = updated;
    } catch (e) {
      console.error(e);
    }
  }

  async function applyPreset(preset: 'optimal' | 'drought' | 'heatwave' | 'torrential_rain' | 'frost') {
    try {
      const updated = await api.applySimulatorPreset(preset);
      state.value = updated;
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleHardware(key: 'sensor' | 'valve' | 'drone' | 'meteo' | 'hub') {
    try {
      const updated = await api.toggleSimulatorHardware(key);
      state.value = updated;
    } catch (e) {
      console.error(e);
    }
  }

  function setAutonomyLevel(level: 'advisory' | 'supervised' | 'autonomous') {
    updateVariables({ autonomyLevel: level });
  }

  function addCurrentHardwareToCart() {
    const cartStore = useCartStore();
    const productsStore = useProductsStore();

    const hwMapping: Record<string, string> = {
      sensor: 'prod-001',
      valve: 'prod-002',
      drone: 'prod-003',
      meteo: 'prod-004',
      hub: 'prod-005',
    };

    let addedCount = 0;
    Object.entries(state.value.installedHardware).forEach(([key, isInstalled]) => {
      if (isInstalled && hwMapping[key]) {
        const prod = productsStore.products.find(p => p.id === hwMapping[key]);
        if (prod) {
          cartStore.addItem(prod, 1);
          addedCount++;
        }
      }
    });

    return addedCount;
  }

  const activeHardwareCount = computed(() => {
    return Object.values(state.value.installedHardware).filter(Boolean).length;
  });

  return {
    state,
    isLoading,
    activeHardwareCount,
    fetchState,
    updateVariables,
    applyPreset,
    toggleHardware,
    setAutonomyLevel,
    addCurrentHardwareToCart,
  };
});
