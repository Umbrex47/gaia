<script setup lang="ts">
import { onMounted } from 'vue';
import TopBar from './components/layout/TopBar.vue';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import CartDrawer from './components/cart/CartDrawer.vue';
import CheckoutModal from './components/cart/CheckoutModal.vue';
import AuthModal from './components/auth/AuthModal.vue';
import ProductModal from './components/store/ProductModal.vue';
import ChatBotWidget from './components/chatbot/ChatBotWidget.vue';
import { useProductsStore } from './stores/products';

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.fetchProducts();
});
</script>

<template>
  <div class="gaia-app-layout">
    <TopBar />
    <Navbar />
    
    <div class="gaia-content-area">
      <router-view />
    </div>

    <Footer />

    <!-- Global Floating Widgets & Modals -->
    <CartDrawer />
    <CheckoutModal />
    <AuthModal />
    <ProductModal />
    <ChatBotWidget />
  </div>
</template>

<style scoped>
.gaia-app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.gaia-content-area {
  flex: 1;
}
</style>
