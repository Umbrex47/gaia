# 🌿 GaIA: Plataforma de Automatización Agrícola Inteligente

> *"La inteligencia de la naturaleza, potenciada por agentes de IA autónomos. Del sensor al dron, del análisis a la acción."*

GaIA es una solución AgTech integral diseñada para revolucionar la agricultura mediante la integración de hardware de estándar abierto (sensores de suelo, electroválvulas solares, microcontroladores industriales y drones multiespectrales) y un software avanzado de agentes de IA autónomos que toman decisiones y ejecutan acciones en campo.

---

## 🚀 Arquitectura y Tecnologías Utilizadas

- **Backend**: **NestJS 10** (TypeScript, Arquitectura Modular Limpia, Swagger OpenAPI, Passport JWT, Mongoose/MongoDB con motor autónomo de memoria).
- **Frontend**: **Vue.js 3** (Composition API `<script setup>`, Vite, TypeScript, **Pinia**, **Vue Router**, Lucide Icons, Canvas Confetti).
- **Diseño & CSS**: Sistema modular de **CSS Variables** y **Media Queries organizadas** para móviles (`<640px`), tablets (`640-1024px`), desktop (`>1024px`) y pantallas ultra-wide (`>1440px`).
- **SEO de Vanguardia**: HTML5 semántico estructurado, microdatos JSON-LD (`Organization`, `Product`, `FAQPage`, `WebSite`), meta tags OpenGraph y Twitter Cards.

---

## 🌟 Componentes y Funcionalidades Principales

1. **Dashboard Simulador de Cultivos ("Tinkercad Agrícola de GaIA")**:
   - Experimenta virtualmente con tu lote antes de adquirir hardware.
   - Modifica en tiempo real: Humedad del suelo (%), Temperatura (°C), Radiación Solar (W/m²), Infestación de plagas (%).
   - Escenarios climáticos rápidos: *Día Óptimo*, *Sequía*, *Ola de Calor*, *Lluvia Torrencial*, *Helada*.
   - Inventario de hardware instalable en el surco: Sensor SoilSense Pro, Válvula HydroValve 24V, Dron AeroScout X4, MeteoStation 4G y GaIA Brain Hub.
   - Consola de toma de decisiones autónomas de los agentes (`HydroAgent`, `SentinelAgent`, `MeteoEngine`).
   - Botón directo **"Comprar este Kit"** para transferir el setup virtual al carrito de compras.

2. **Tienda Online de Hardware & Integraciones**:
   - Catálogo de sensores, válvulas, drones, hubs y accesorios.
   - Buscador reactivo instantáneo en la cabecera y en la tienda con desplegable en vivo.
   - Ficha técnica completa de cada dispositivo con botón "Probar en Simulador".

3. **Pasarela de Pago Lista para Producción**:
   - Carrito persistente en `localStorage` con cálculo dinámico de envío e impuestos.
   - Validación de tarjetas mediante el algoritmo de Luhn (detección de Visa, Mastercard, Amex).
   - Mockups listos para conectar llaves de destino Stripe y MercadoPago mediante variables de entorno.
   - Explosión de confeti y generación de código de orden al confirmar el pago.

4. **Chatbot Agronómico con Razonamiento Real ("Piensa de verdad")**:
   - Visualización del proceso interno de pensamiento (*Thinking Process* paso a paso).
   - Diagnósticos agronómicos precisos (curvas de retención de agua, cálculo de dosis NDVI, arquitectura LoRaWAN sin internet).
   - Recomendación directa de productos de la tienda GaIA.

5. **Sobre Nosotros & Filosofía de Hardware Abierto**:
   - Presentación de la empresa y desglose de las dos áreas: Hardware Integrado (sin amarre a marcas cautivas) y Software/IA (el cerebro diferenciador).
   - Estructura de costos transparente: Costos variables de instalación vs Suscripción SaaS por hectárea con soporte técnico y garantía.

6. **Planes & Calculadora Interactiva de Hectáreas y ROI**:
   - Planes *Semilla* (pequeñas parcelas), *Finca Productiva* (mediana escala) y *GaIA Enterprise* (drones y modelos a medida).
   - Calculadora dinámica que simula el costo inicial, la mensualidad y el tiempo de recuperación de inversión (ROI en meses).

7. **Blog de Innovaciones, Logros y FAQs**:
   - Artículos con tiempos de lectura, categorías y autores.
   - Sección interactiva de Preguntas Frecuentes con acordeón y filtros por temas.

8. **Autenticación Completa (JWT)**:
   - Iniciar Sesión y Registro de Productores con datos de la finca y cultivo.
   - Cuentas demo precargadas para probar en un clic (`juan@fincaesperanza.com` y `admin@gaia-agritech.com`).

---

## 🛠️ Instrucciones de Ejecución

### 1. Iniciar el Backend (NestJS):
```bash
cd backend
npm run start:dev
```
- API REST activa en: `http://localhost:3000`
- Documentación Swagger interactiva: `http://localhost:3000/api/docs`

### 2. Iniciar el Frontend (Vue.js 3):
```bash
cd frontend
npm run dev
```
- Aplicación web activa en: `http://localhost:5173`

### 3. Ejecutar Pruebas Automatizadas:
```bash
cd backend
npm test
```
