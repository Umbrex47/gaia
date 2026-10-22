import { Injectable } from '@nestjs/common';

export interface SimulatorState {
  soilMoisture: number; // %
  temperature: number; // °C
  solarRadiation: number; // W/m²
  pestPressure: number; // %
  cropStage: 'germination' | 'vegetative' | 'flowering' | 'harvest';
  weatherPreset: 'optimal' | 'drought' | 'heatwave' | 'torrential_rain' | 'frost';
  autonomyLevel: 'advisory' | 'supervised' | 'autonomous';
  installedHardware: {
    sensor: boolean;
    valve: boolean;
    drone: boolean;
    meteo: boolean;
    hub: boolean;
  };
  actuators: {
    valveOpen: boolean;
    droneFlying: boolean;
    droneMission: 'idle' | 'scanning_ndvi' | 'spraying_biocontrol';
    lastWaterLiters: number;
  };
  cropHealthScore: number; // 0 - 100
  eventLogs: Array<{
    id: string;
    timestamp: string;
    agent: 'HydroAgent' | 'SentinelAgent' | 'MeteoEngine' | 'GaIA-Brain';
    type: 'info' | 'warning' | 'action' | 'success';
    message: string;
  }>;
}

@Injectable()
export class SimulatorService {
  private state: SimulatorState = {
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
    eventLogs: [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleTimeString(),
        agent: 'GaIA-Brain',
        type: 'info',
        message: 'Sistema GaIA Hub en línea. Protocolo LoRaWAN sincronizado con 3 nodos de campo.',
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleTimeString(),
        agent: 'HydroAgent',
        type: 'success',
        message: 'Humedad en zona radicular óptima (42%). Riego en reposo.',
      },
    ],
  };

  getState(): SimulatorState {
    return this.state;
  }

  updateVariables(partial: Partial<SimulatorState>): SimulatorState {
    const prevMoisture = this.state.soilMoisture;
    const prevPest = this.state.pestPressure;

    // Apply updates
    this.state = {
      ...this.state,
      ...partial,
      installedHardware: {
        ...this.state.installedHardware,
        ...(partial.installedHardware || {}),
      },
      actuators: {
        ...this.state.actuators,
        ...(partial.actuators || {}),
      },
    };

    const time = new Date().toLocaleTimeString();

    // 1. EVALUATE HYDRO AGENT
    if (this.state.installedHardware.sensor && this.state.installedHardware.valve) {
      if (this.state.soilMoisture < 28) {
        if (!this.state.actuators.valveOpen) {
          if (this.state.autonomyLevel === 'autonomous') {
            this.state.actuators.valveOpen = true;
            this.state.actuators.lastWaterLiters += 120;
            this.state.soilMoisture = Math.min(65, this.state.soilMoisture + 18);
            this.state.eventLogs.unshift({
              id: `log-${Date.now()}-1`,
              timestamp: time,
              agent: 'HydroAgent',
              type: 'action',
              message: `[ACCIÓN AUTÓNOMA] Humedad cayó a ${Math.round(prevMoisture)}% (crítico <28%). Apertura de HydroValve 24V durante 180s. +120L dosificados.`,
            });
          } else {
            this.state.eventLogs.unshift({
              id: `log-${Date.now()}-1`,
              timestamp: time,
              agent: 'HydroAgent',
              type: 'warning',
              message: `[ALERTA ASESOR] Humedad en ${Math.round(this.state.soilMoisture)}%. Se recomienda abrir válvula de riego. Modo: ${this.state.autonomyLevel}.`,
            });
          }
        }
      } else if (this.state.soilMoisture > 75) {
        if (this.state.actuators.valveOpen) {
          this.state.actuators.valveOpen = false;
          this.state.eventLogs.unshift({
            id: `log-${Date.now()}-2`,
            timestamp: time,
            agent: 'HydroAgent',
            type: 'info',
            message: `Humedad de saturación alcanzada (${Math.round(this.state.soilMoisture)}%). Cierre de válvula ejecutado para prevenir anoxia radicular.`,
          });
        }
      }
    } else if (this.state.soilMoisture < 28 && !this.state.installedHardware.sensor) {
      this.state.eventLogs.unshift({
        id: `log-${Date.now()}-nosensor`,
        timestamp: time,
        agent: 'GaIA-Brain',
        type: 'warning',
        message: 'Déficit hídrico no detectado por GaIA: No hay sensor SoilSense Pro instalado en este sector.',
      });
    }

    // 2. EVALUATE SENTINEL AGENT (PESTS & DRONES)
    if (this.state.pestPressure > 35) {
      if (this.state.installedHardware.drone) {
        if (!this.state.actuators.droneFlying) {
          this.state.actuators.droneFlying = true;
          this.state.actuators.droneMission = 'spraying_biocontrol';
          this.state.pestPressure = Math.max(8, this.state.pestPressure - 25);
          this.state.eventLogs.unshift({
            id: `log-${Date.now()}-3`,
            timestamp: time,
            agent: 'SentinelAgent',
            type: 'action',
            message: `[MISIÓN DRON ACTIVADA] Índice de infestación al ${Math.round(prevPest)}%. GaIA AeroScout X4 desplegado. Microaspersión de extracto de neem completada.`,
          });
        }
      } else {
        this.state.eventLogs.unshift({
          id: `log-${Date.now()}-4`,
          timestamp: time,
          agent: 'SentinelAgent',
          type: 'warning',
          message: `Alerta fitosanitaria: Brote de insectos detectado (${Math.round(this.state.pestPressure)}%). Instala el dron AeroScout X4 para neutralizarlo en vuelo.`,
        });
      }
    } else if (this.state.actuators.droneFlying && this.state.pestPressure <= 15) {
      this.state.actuators.droneFlying = false;
      this.state.actuators.droneMission = 'idle';
      this.state.eventLogs.unshift({
        id: `log-${Date.now()}-drone-dock`,
        timestamp: time,
        agent: 'SentinelAgent',
        type: 'success',
        message: 'AeroScout X4 regresó a su estación de carga. Lote desparasitado con éxito.',
      });
    }

    // 3. RECALCULATE HEALTH SCORE
    let score = 100;
    // Moisture penalty
    if (this.state.soilMoisture < 30) score -= (30 - this.state.soilMoisture) * 1.5;
    if (this.state.soilMoisture > 75) score -= (this.state.soilMoisture - 75) * 1.2;
    // Temperature penalty
    if (this.state.temperature > 34) score -= (this.state.temperature - 34) * 2;
    if (this.state.temperature < 14) score -= (14 - this.state.temperature) * 2;
    // Pest penalty
    score -= this.state.pestPressure * 0.45;

    this.state.cropHealthScore = Math.max(10, Math.min(100, Math.round(score)));

    // Keep log max length 20
    if (this.state.eventLogs.length > 20) {
      this.state.eventLogs = this.state.eventLogs.slice(0, 20);
    }

    return this.state;
  }

  applyPreset(preset: 'optimal' | 'drought' | 'heatwave' | 'torrential_rain' | 'frost'): SimulatorState {
    const time = new Date().toLocaleTimeString();
    let updates: Partial<SimulatorState> = { weatherPreset: preset };

    switch (preset) {
      case 'optimal':
        updates = {
          weatherPreset: 'optimal',
          soilMoisture: 48,
          temperature: 23,
          solarRadiation: 650,
          pestPressure: 5,
        };
        break;
      case 'drought':
        updates = {
          weatherPreset: 'drought',
          soilMoisture: 16,
          temperature: 36,
          solarRadiation: 950,
          pestPressure: 28,
        };
        break;
      case 'heatwave':
        updates = {
          weatherPreset: 'heatwave',
          soilMoisture: 24,
          temperature: 41,
          solarRadiation: 1100,
          pestPressure: 45,
        };
        break;
      case 'torrential_rain':
        updates = {
          weatherPreset: 'torrential_rain',
          soilMoisture: 88,
          temperature: 19,
          solarRadiation: 220,
          pestPressure: 15,
        };
        break;
      case 'frost':
        updates = {
          weatherPreset: 'frost',
          soilMoisture: 38,
          temperature: 2,
          solarRadiation: 300,
          pestPressure: 2,
        };
        break;
    }

    this.state.eventLogs.unshift({
      id: `preset-${Date.now()}`,
      timestamp: time,
      agent: 'MeteoEngine',
      type: 'info',
      message: `Escenario climático aplicado: ${preset.toUpperCase()}. Calculando respuesta adaptativa de GaIA...`,
    });

    return this.updateVariables(updates);
  }

  toggleHardware(key: 'sensor' | 'valve' | 'drone' | 'meteo' | 'hub'): SimulatorState {
    const current = !!this.state.installedHardware[key];
    const next = !current;
    const time = new Date().toLocaleTimeString();

    const names = {
      sensor: 'Sensor SoilSense Pro',
      valve: 'Electroválvula HydroValve 24V',
      drone: 'Dron Autónomo AeroScout X4',
      meteo: 'Micro-Estación MeteoStation 4G',
      hub: 'Controlador Central GaIA Hub',
    };

    this.state.installedHardware[key] = next;

    this.state.eventLogs.unshift({
      id: `hw-${Date.now()}`,
      timestamp: time,
      agent: 'GaIA-Brain',
      type: next ? 'success' : 'warning',
      message: `${names[key]} ${next ? 'CONECTADO Y VINCULADO AL LOTE' : 'DESCONECTADO DE LA RED'}.`,
    });

    return this.updateVariables({});
  }
}
