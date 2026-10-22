<script setup lang="ts">
import HeroSection from '../components/home/HeroSection.vue';
import TelemetryTicker from '../components/home/TelemetryTicker.vue';
import AboutSection from '../components/home/AboutSection.vue';
import FeaturesSection from '../components/home/FeaturesSection.vue';
import PricingSection from '../components/home/PricingSection.vue';
import StoreSection from '../components/home/StoreSection.vue';
import BlogSection from '../components/home/BlogSection.vue';
import FaqSection from '../components/home/FaqSection.vue';
import ContactSection from '../components/home/ContactSection.vue';
</script>

<template>
  <main class="home-page">
    <HeroSection />
    <TelemetryTicker />
    <AboutSection />
    <FeaturesSection />
    <PricingSection />
    <StoreSection />
    <BlogSection />
    <FaqSection />
    <ContactSection />
  </main>
</template>

<style scoped>
.home-page {
  position: relative;
  background: var(--color-liquid-abyss);
}
</style>
