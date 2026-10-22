import { Injectable, Logger } from '@nestjs/common';
import { DataStoreService } from '../database/data-store.service';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  thinking?: string[];
  recommendedHardwareIds?: string[];
  timestamp: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly dataStore: DataStoreService) {}

  async processMessage(userMessage: string = '', history: ChatMessage[] = []): Promise<ChatMessage> {
    const q = (userMessage || '').toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let thinkingSteps: string[] = [];
    let responseText = '';
    let recommendedIds: string[] = [];

    // Intelligent Agronomic Reasoning Engine
    if (q.includes('riego') || q.includes('agua') || q.includes('humedad') || q.includes('sequia') || q.includes('secar')) {
      thinkingSteps = [
        'Paso 1: Analizando balance hídrico del cultivo y dinámica de transpiración...',
        'Paso 2: Evaluando tipos de suelo (arcilloso vs arenoso) y velocidad de infiltración estándar...',
        'Paso 3: Correlacionando ahorro de agua vs riesgo de asfixia radicular...',
        'Paso 4: Seleccionando arquitectura de hardware GaIA óptima (Sensor VWC + Solenoide biestable LoRa)...',
      ];
      responseText = `Para optimizar el riego y evitar tanto el estrés hídrico como el encharcamiento, la regla de oro en GaIA es **regar por demanda real de la planta, no por horario fijo**.\n\n` +
        `🌾 **Diagnóstico Técnico GaIA:**\n` +
        `- Si el suelo es franco-arcilloso, el punto de marchitez permanente suele rondar el 18-22% VWC, mientras que la capacidad de campo está cerca del 40%.\n` +
        `- **Estrategia Recomendada:** Mantener la humedad entre el 32% y el 45% mediante micro-pulsos de 15 minutos en las horas de menor evapotranspiración (05:00 a 08:00 o después de las 17:30).\n\n` +
        `🛠️ **Componentes GaIA Sugeridos:**\n` +
        `- **GaIA SoilSense Pro**: Mide VWC en 3 estratos radiculares sin descalibrarse.\n` +
        `- **HydroValve 24V LoRa**: Recibe la orden de nuestro agente Hydro y dosifica el agua milimétricamente.`;
      recommendedIds = ['prod-001', 'prod-002'];
    } else if (q.includes('plaga') || q.includes('bicho') || q.includes('hongo') || q.includes('enfermedad') || q.includes('roya') || q.includes('dron')) {
      thinkingSteps = [
        'Paso 1: Descomponiendo vector fitopatológico y signología descrita...',
        'Paso 2: Evaluando ventanas de intervención con imágenes multiespectrales (NDVI y NDRE)...',
        'Paso 3: Contrastando costo de aspersión generalizada de agroquímicos vs microaspersión focalizada...',
        'Paso 4: Planificando misión de vuelo autónomo para el GaIA AeroScout X4...',
      ];
      responseText = `La proliferación de plagas y patógenos fúngicos (como royas o mildius) suele pasar desapercibida hasta que el daño supera el 25% foliar.\n\n` +
        `🔬 **Razonamiento GaIA Sentinel:**\n` +
        `- En fase subclínica, el colapso del mesófilo foliar refleja menos radiación en la banda NIR (790 nm).\n` +
        `- Mediante patrullaje aéreo con el dron **AeroScout X4**, detectamos la disminución de clorofila 10 a 14 días antes de que aparezcan pústulas visibles.\n\n` +
        `🎯 **Acción recomendada:** Aplicar bio-insumo o bacillus thuringiensis exclusivamente en el polígono con reflectancia anómala, ahorrando hasta un 85% en agroquímicos.`;
      recommendedIds = ['prod-003', 'prod-004'];
    } else if (q.includes('internet') || q.includes('señal') || q.includes('cobertura') || q.includes('lejos') || q.includes('montaña')) {
      thinkingSteps = [
        'Paso 1: Evaluando topografía rural y atenuación de señales electromagnéticas...',
        'Paso 2: Descartando arquitecturas basadas en nube pura por vulnerabilidad de desconexión...',
        'Paso 3: Validando red local LoRaWAN 915MHz con topología de estrella y edge computing...',
        'Paso 4: Confirmando persistencia local de datos en memoria no volátil del GaIA Brain Hub...',
      ];
      responseText = `GaIA fue diseñada pensando en la realidad del agro latinoamericano: **la desconexión es la norma, no la excepción**.\n\n` +
        `📡 **¿Cómo funciona sin internet?**\n` +
        `- Nuestro **GaIA Brain Edge Hub** posee una NPU integrada que procesa los algoritmos de IA de forma autónoma en la misma finca.\n` +
        `- La comunicación con sensores y válvulas se realiza mediante **LoRaWAN (915 MHz)**, capaz de atravesar 12-15 km de terreno escarpado y vegetación densa sin cables ni internet.\n` +
        `- Si la red satelital o celular vuelve a estar disponible, GaIA sincroniza automáticamente toda la telemetría histórica con la nube.`;
      recommendedIds = ['prod-005'];
    } else if (q.includes('precio') || q.includes('costo') || q.includes('cuanto') || q.includes('vale') || q.includes('plan')) {
      thinkingSteps = [
        'Paso 1: Desglosando estructura financiera (CAPEX vs OPEX)...',
        'Paso 2: Mapeando rangos de área agrícola (Parcela Familiar, Finca Productiva, Enterprise)...',
        'Paso 3: Calculando amortización por ahorro hídrico y reducción de agroinsumos...',
      ];
      responseText = `Nuestra política de costos es 100% transparente y se adapta al tamaño de tu producción:\n\n` +
        `💰 **Estructura Financiera GaIA:**\n` +
        `1. **Costo de Hardware & Instalación (Único):** Equipos seleccionados a la medida de tu cultivo + calibración técnica en terreno.\n` +
        `2. **Suscripción Mensual:**\n` +
        `   - **Plan Semilla (<2 Ha):** Desde $29 USD/mes.\n` +
        `   - **Plan Finca Productiva (Hasta 50 Ha):** Desde $89 USD/mes (incluye agentes autónomos de riego y plagas).\n` +
        `   - **Plan Agro-Industria Enterprise (>50 Ha):** Cotización a la medida con soporte para drones y modelos de IA personalizados.\n\n` +
        `Puedes usar nuestra calculadora interactiva en la sección de Planes para ver el estimado exacto.`;
      recommendedIds = ['prod-001', 'prod-002', 'prod-005'];
    } else {
      thinkingSteps = [
        'Paso 1: Analizando consulta agronómica general del usuario...',
        'Paso 2: Consultando la base de conocimientos de agro-robótica e IA de GaIA...',
        'Paso 3: Estructurando recomendación técnica con enfoque en autonomía y rentabilidad...',
      ];
      responseText = `Hola, soy el Agente de IA Agronómica de **GaIA** 🌿.\n\n` +
        `Puedo ayudarte a diagnosticar problemas de tu cultivo, calibrar tu balance hídrico, planificar barridos con drones multiespectrales o sugerir la configuración ideal de sensores y válvulas para tu finca.\n\n` +
        `¿De qué cultivo se trata (ej. café, aguacate, maíz, hortalizas) y cuántas hectáreas tienes en producción?`;
    }

    return {
      id: `bot-msg-${Date.now()}`,
      sender: 'assistant',
      content: responseText,
      thinking: thinkingSteps,
      recommendedHardwareIds: recommendedIds,
      timestamp: time,
    };
  }
}
