import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'GaIA | Automatización Agrícola Inteligente & Agentes de IA',
        description: 'La plataforma que transforma el campo mediante agentes de IA autónomos, sensores, válvulas y drones agrícolas.',
      },
    },
    {
      path: '/simulador',
      redirect: '/tienda',
    },
    {
      path: '/tienda',
      name: 'store',
      component: () => import('../views/StoreView.vue'),
      meta: {
        title: 'Tienda de Hardware & Integraciones IoT | GaIA',
        description: 'Catálogo de sensores de suelo LoRaWAN, electroválvulas solares, drones multiespectrales y cerebros Edge AI.',
      },
    },
    {
      path: '/planes',
      name: 'plans',
      component: () => import('../views/PlansView.vue'),
      meta: {
        title: 'Planes & Precios de Suscripción | GaIA AgroTech',
        description: 'Calcula el costo inicial de instalación y tu mensualidad por hectárea con nuestra calculadora inteligente.',
      },
    },
    {
      path: '/nosotros',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'Sobre GaIA | Filosofía de Hardware Abierto + Software de IA',
        description: 'Conoce cómo GaIA no impone hardware propietario, sino que integra los mejores dispositivos del mundo con IA.',
      },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
      meta: {
        title: 'Blog de Innovación & Casos de Éxito Agrícola | GaIA',
        description: 'Artículos técnicos sobre índices NDVI, telemetría LoRaWAN y reducción del consumo de agua con IA.',
      },
    },
    {
      path: '/contacto',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {
        title: 'Contacto & Cotizaciones de Campo | GaIA',
        description: 'Comunícate con nuestros ingenieros agrónomos y de software para diseñar la automatización de tu lote.',
      },
    },
    {
      path: '/registro',
      name: 'register',
      component: HomeView,
      meta: {
        title: 'Crear Cuenta de Finca | GaIA AgroTech',
        description: 'Regístrate en GaIA y comienza a monitorear y automatizar tu campo con agentes de IA.',
        openAuthModal: 'register',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: HomeView,
      meta: {
        title: 'Iniciar Sesión | Portal Agricultores GaIA',
        description: 'Accede a tu dashboard de telemetría y control agronómico con IA.',
        openAuthModal: 'login',
      },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue'),
      meta: {
        title: 'Validación de Cuenta | GaIA AgroTech',
        description: 'Verificación de cuenta y activación de productor agrícola.',
      },
    },
  ],
});

router.afterEach((to) => {
  if (to.meta.openAuthModal) {
    const authStore = useAuthStore();
    authStore.openAuthModal(to.meta.openAuthModal as 'login' | 'register');
  }
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && to.meta.description) {
    metaDesc.setAttribute('content', to.meta.description as string);
  }
});

export default router;
