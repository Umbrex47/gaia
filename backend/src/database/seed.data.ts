export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'sensors' | 'valves' | 'drones' | 'controllers' | 'accessories';
  price: number;
  comparePrice?: number;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  image: string;
  stock: number;
  tags: string[];
  simulatorCompatible: boolean;
  simulatorType?: 'sensor' | 'valve' | 'drone' | 'meteo' | 'hub';
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  content: string;
  image: string;
  tags: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'hardware' | 'ia' | 'costos' | 'conectividad';
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Sensor de Suelo GaIA SoilSense Pro',
    slug: 'gaia-soilsense-pro',
    category: 'sensors',
    price: 149.00,
    comparePrice: 179.00,
    rating: 4.9,
    reviewsCount: 38,
    shortDescription: 'Sensor industrial de humedad volumétrica (VWC), temperatura, electroconductividad (EC) y estimación NPK con enlace LoRaWAN de 12km.',
    description: 'El GaIA SoilSense Pro penetra hasta 30cm en el perfil radicular para recopilar datos de humedad y salinidad cada 3 minutos. Su carcasa de acero inoxidable grado 316 y resina epóxica militar garantizan 10 años de vida útil en suelos altamente corrosivos.',
    specs: {
      'Rango de Humedad': '0 a 100% VWC (Precisión ±1.5%)',
      'Rango de Temperatura': '-40°C a +85°C',
      'Protocolos': 'LoRaWAN 915MHz / Modbus RS485 / Bluetooth 5.2',
      'Batería': 'Litio-Tionilo 3.6V (Duración hasta 5 años)',
      'Protección': 'IP68 Sumergible continuo'
    },
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    stock: 65,
    tags: ['IoT', 'Humedad', 'LoRaWAN', 'Suelo'],
    simulatorCompatible: true,
    simulatorType: 'sensor'
  },
  {
    id: 'prod-002',
    name: 'Electroválvula Inteligente HydroValve 24V LoRa',
    slug: 'gaia-hydrovalve-24v',
    category: 'valves',
    price: 189.00,
    comparePrice: 219.00,
    rating: 4.8,
    reviewsCount: 29,
    shortDescription: 'Válvula solenoide de pulso biestable de 1" a 3" con microcontrolador integrado y alimentación por celda solar monocristalina.',
    description: 'Olvídate del cableado de alta tensión en campo abierto. HydroValve 24V opera con energía solar y recibe comandos autónomos de apertura milimétrica emitidos por el agente de IA de riego GaIA.',
    specs: {
      'Diámetro': '1 pulgada (opcional adaptador 2" y 3")',
      'Presión Operativa': '0.5 a 10 Bar (7 a 145 PSI)',
      'Alimentación': 'Panel solar 5W + Batería LiFePO4 integrada',
      'Caudal Máximo': '15 m³/hora',
      'Modos': 'Apertura porcentual, temporizado y por volumen m³'
    },
    image: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
    stock: 42,
    tags: ['Riego', 'Válvula', 'Solar', 'Automatización'],
    simulatorCompatible: true,
    simulatorType: 'valve'
  },
  {
    id: 'prod-003',
    name: 'Dron Agrícola Autónomo GaIA AeroScout X4',
    slug: 'gaia-aeroscout-x4',
    category: 'drones',
    price: 3450.00,
    comparePrice: 3890.00,
    rating: 5.0,
    reviewsCount: 17,
    shortDescription: 'Quadcopter industrial con cámara multiespectral de 5 bandas, módulo RTK centimétrico y tanque de microaspersión focalizada de 16 litros.',
    description: 'El AeroScout X4 despega automáticamente desde su estación de carga cuando el agente de IA Sentinel detecta anomalías de vigor vegetal (NDVI). Realiza barridos topográficos y pulveriza bio-insumos únicamente en las plantas afectadas.',
    specs: {
      'Cámara': 'Multiespectral 5 bandas (Red, Green, Blue, RedEdge, NIR)',
      'Autonomía de Vuelo': '38 minutos por pack de batería',
      'Tanque de Aspersión': '16 Litros con toberas centrífugas electrostáticas',
      'Posicionamiento': 'RTK con precisión de 1.5 cm',
      'Misión': 'Vuelo autónomo por waypoints calculados por IA'
    },
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    tags: ['Dron', 'NDVI', 'Multiespectral', 'Plagas'],
    simulatorCompatible: true,
    simulatorType: 'drone'
  },
  {
    id: 'prod-004',
    name: 'Micro-Estación Meteorológica MeteoStation 4G',
    slug: 'gaia-meteostation-4g',
    category: 'sensors',
    price: 620.00,
    comparePrice: 710.00,
    rating: 4.9,
    reviewsCount: 22,
    shortDescription: 'Estación compacta todo-en-uno sin partes móviles: pluviómetro acústico, radiación solar PAR, viento ultrasónico y punto de rocío.',
    description: 'Monitorea el microclima exacto de tu lote. Sus datos alimentan el modelo de evapotranspiración (ETo) de GaIA para predecir con exactitud cuándo y cuánto regar antes de que se presente estrés hídrico.',
    specs: {
      'Sensores': 'Viento ultrasónico, Pluviómetro acústico, Temp/Humedad, Radiación Solar, Presión',
      'Conectividad': 'Módem 4G LTE Global + Micro-SIM GaIA Multicarrier',
      'Alimentación': 'Panel solar 20W integrado + Batería para 15 días sin sol',
      'Intervalo de Telemetría': 'Configurable de 1 a 60 minutos'
    },
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    tags: ['Clima', 'Meteorología', 'Pluviómetro', 'Radiación'],
    simulatorCompatible: true,
    simulatorType: 'meteo'
  },
  {
    id: 'prod-005',
    name: 'Controlador Central GaIA Brain Edge Hub',
    slug: 'gaia-brain-hub',
    category: 'controllers',
    price: 480.00,
    comparePrice: 540.00,
    rating: 5.0,
    reviewsCount: 31,
    shortDescription: 'Cerebro de borde con procesador neural NPU de 6 TOPS. Ejecuta agentes de IA locales sin requerir conexión permanente a internet.',
    description: 'El GaIA Brain Hub es el epicentro de la finca. Coordina hasta 128 nodos sensores y 32 válvulas por LoRa a 15 km de distancia. Si se cae la conexión a internet, sus agentes continúan tomando decisiones de riego y protección de forma 100% autónoma.',
    specs: {
      'Procesador': 'Quad-Core 64-bit + 6 TOPS NPU para inferencia de IA',
      'Gateway LoRaWAN': 'SX1302 8 canales simultáneos (915MHz / 868MHz)',
      'Conectividad': 'WiFi dual-band, Ethernet Gigabit, 4G LTE Backup',
      'Almacenamiento': '128GB NVMe de grado industrial para historial agronómico',
      'Gabinete': 'NEMA 4X / IP66 con llave de seguridad y disipador pasivo'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    tags: ['Edge AI', 'Hub', 'LoRa Gateway', 'Cerebro'],
    simulatorCompatible: true,
    simulatorType: 'hub'
  },
  {
    id: 'prod-006',
    name: 'Módulo de Fertirriego Dosificador PrecisionNutri',
    slug: 'gaia-precisionnutri',
    category: 'accessories',
    price: 340.00,
    comparePrice: 395.00,
    rating: 4.7,
    reviewsCount: 14,
    shortDescription: 'Inyector Venturi automatizado para aplicación de fertilizantes NPK y enmiendas orgánicas según la curva fenológica del cultivo.',
    description: 'Optimiza la dosificación de nutrientes inyectando la mezcla exacta según la conductividad eléctrica y el pH objetivo determinado por el agente agronómico de GaIA.',
    specs: {
      'Capacidad de Inyección': '10 a 250 L/h ajustable',
      'Control': 'PWM digital mediante protocolo Modbus / GaIA Link',
      'Material': 'PVDF de alta resistencia química a ácidos y abonos concentrados'
    },
    image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    tags: ['Fertirriego', 'Nutrientes', 'Inyector'],
    simulatorCompatible: false
  }
];

export const SEED_ARTICLES: BlogArticle[] = [
  {
    id: 'art-001',
    title: 'Cómo los Agentes de IA redujeron el consumo hídrico un 42% en cultivos de aguacate Hass',
    slug: 'agentes-ia-reduccion-consumo-hidrico-aguacate',
    category: 'Casos de Éxito',
    readTime: '5 min',
    date: '18 Octubre 2026',
    author: {
      name: 'Dra. Elena Santamaría',
      role: 'Directora de Agronomía Computacional en GaIA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    summary: 'Análisis del despliegue de agentes autónomos Hydro en 80 hectáreas. Resultados en balance hídrico, sanidad radicular y disminución del gasto energético de bombeo.',
    content: `La agricultura bajo riego representa más del 70% de las extracciones mundiales de agua dulce. En el caso del aguacate Hass, el exceso de humedad causa asfixia radicular y brotes de *Phytophthora cinnamomi*, mientras que el déficit hídrico aborta la floración.

En el piloto realizado en el Valle del Cauca, GaIA integró sensores SoilSense Pro a tres profundidades (15cm, 30cm y 60cm) junto con válvulas HydroValve 24V gestionadas por nuestro agente autónomo de IA. El sistema ajustó las ventanas de riego a las horas de menor radiación solar basándose en la evapotranspiración pronosticada.

**Resultados obtenidos tras 6 meses:**
- 42.4% de reducción en el volumen de agua bombeada.
- 18.2% de incremento en el calibre del fruto de exportación.
- Cero incidentes de pudrición radicular en los lotes controlados por GaIA.`,
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    tags: ['Aguacate', 'Riego Inteligente', 'Casos de Éxito', 'Sostenibilidad']
  },
  {
    id: 'art-002',
    title: 'Imágenes Multiespectrales NDVI: Detectando plagas y estrés 14 días antes del ojo humano',
    slug: 'imagenes-multiespectrales-ndvi-deteccion-temprana',
    category: 'Tecnología',
    readTime: '7 min',
    date: '10 Octubre 2026',
    author: {
      name: 'Ing. Carlos Mendoza',
      role: 'Especialista en Robótica Aérea GaIA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    summary: 'Explicación técnica del cálculo del índice de vegetación NDVI y RedEdge con drones GaIA AeroScout X4 para neutralizar focos de plaga en fase subclínica.',
    content: `Cuando un agricultor nota manchas amarillas en las hojas a simple vista, la infestación ya tiene al menos dos semanas desarrollándose internamente en los tejidos de la planta. 

La reflectancia en la banda del infrarrojo cercano (NIR) disminuye drásticamente en cuanto la clorofila y la estructura celular mesófila sufren estrés. Mediante vuelos programados de dron a 60 metros de altitud, el GaIA AeroScout X4 genera ortomosaicos calibrados radiométricamente.

El agente de visión computacional de GaIA segmenta los focos de calor y emite coordenadas precisas al dron de aplicación para suministrar control biológico focalizado, erradicando la necesidad de fumigaciones masivas de químicos.`,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    tags: ['Drones', 'NDVI', 'Visión por Computadora', 'Control Biológico']
  },
  {
    id: 'art-003',
    title: 'GaIA Brain 2.0: Arquitectura Edge Computing para fincas agrícolas sin internet',
    slug: 'gaia-brain-edge-computing-agricultura-sin-internet',
    category: 'Innovación',
    readTime: '6 min',
    date: '02 Octubre 2026',
    author: {
      name: 'Mateo Roldán',
      role: 'Arquitecto de Sistemas IoT & Edge GaIA',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    summary: 'Cómo diseñamos un sistema con redes en malla LoRaWAN y modelos de IA embebidos capaces de operar meses completos en desconexión total de la nube.',
    content: `Uno de los mayores errores de la digitalización agrícola tradicional es asumir que el campo cuenta con fibra óptica o cobertura 5G. La realidad del sector rural en América Latina y el mundo es la desconexión frecuente.

En GaIA solucionamos esto con computación en el borde (Edge AI). El GaIA Brain Hub almacena un modelo de inferencia cuantizado de 4-bits que evalúa las condiciones del cultivo localmente cada segundo. 

La red LoRaWAN de largo alcance enlaza sensores distribuidos a más de 12 kilómetros a la redonda atravesando bosques y topografías onduladas sin requerir repetidoras complejas.`,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Edge AI', 'IoT', 'LoRaWAN', 'Infraestructura']
  }
];

export const SEED_FAQS: FaqItem[] = [
  {
    id: 'faq-001',
    category: 'hardware',
    question: '¿GaIA fabrica su propio hardware o utiliza componentes estándar?',
    answer: 'En GaIA no te amarramos a hardware propietario cautivo. Seleccionamos, certificamos e integramos el mejor hardware del mercado internacional (sensores SDI-12, válvulas solenoide de pulso, microcontroladores industriales ESP32/ARM y plataformas aéreas DJI/ArduPilot). Nuestro valor diferencial radical radica en el software: la plataforma de analítica y los agentes de IA autónomos que orquestan todos estos dispositivos.'
  },
  {
    id: 'faq-002',
    category: 'conectividad',
    question: '¿Qué sucede si mi finca no tiene cobertura de telefonía celular ni internet?',
    answer: 'GaIA fue concebida para el campo real. El GaIA Brain Hub crea una red privada local LoRaWAN de hasta 15 km de radio de cobertura sin requerir internet. Los agentes de IA de riego y detección toman decisiones de manera local (Edge Computing). Cuando se restablece la conexión o se visita la finca con la app móvil, el sistema sincroniza todo el historial automáticamente.'
  },
  {
    id: 'faq-003',
    category: 'ia',
    question: '¿Puedo limitar el nivel de autonomía de la IA para que solo me sugiera acciones?',
    answer: 'Totalmente. GaIA cuenta con 3 modos de autonomía configurables por lote o cultivo: 1) Modo Asesor (la IA te envía alertas y recomendaciones a WhatsApp y a la app para que tú apruebes cada acción con un toque); 2) Modo Supervisado (la IA ejecuta acciones rutinarias y pide confirmación para dosis elevadas o riegos críticos); y 3) Modo 100% Autónomo (la IA ejecuta ciclos completos de monitoreo, riego y patrullaje de drones según los parámetros agronómicos que establezcas).'
  },
  {
    id: 'faq-004',
    category: 'costos',
    question: '¿Cómo funciona la estructura de precios y el modelo de suscripción?',
    answer: 'Nuestra propuesta consta de dos componentes transparentes: 1) Costo inicial variable de instalación (hardware seleccionado, transporte y calibración en campo por nuestros ingenieros); y 2) Suscripción mensual SaaS por hectárea monitoreada que incluye acceso a la plataforma GaIA, actualizaciones de modelos de IA, soporte técnico agronómico y telemetría continua.'
  },
  {
    id: 'faq-005',
    category: 'hardware',
    question: '¿Qué garantía tienen los equipos instalados?',
    answer: 'Todo el hardware integrado por GaIA cuenta con 12 meses de garantía directa contra defectos de fábrica e intemperie. Adicionalmente, nuestros planes Finca Productiva y Enterprise ofrecen sustitución preventiva y soporte técnico fuera de garantía con tarifas preferenciales y despacho express de repuestos.'
  }
];
