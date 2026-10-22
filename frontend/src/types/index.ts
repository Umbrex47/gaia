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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin' | 'technician';
  farmName?: string;
  hectares?: number;
  cropType?: string;
}

export interface SimulatorState {
  soilMoisture: number;
  temperature: number;
  solarRadiation: number;
  pestPressure: number;
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
  cropHealthScore: number;
  eventLogs: Array<{
    id: string;
    timestamp: string;
    agent: 'HydroAgent' | 'SentinelAgent' | 'MeteoEngine' | 'GaIA-Brain';
    type: 'info' | 'warning' | 'action' | 'success';
    message: string;
  }>;
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
