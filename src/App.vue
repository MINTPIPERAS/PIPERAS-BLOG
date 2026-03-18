<template>
  <!-- <Header /> -->
  <!-- 废弃Header -->
  <Layout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </Layout>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
import Layout from "./components/Layout.vue"
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
