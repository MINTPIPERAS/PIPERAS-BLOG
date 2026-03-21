<template>

  <div class="layout">
  
    <Navbar />
  
    <main class="content-wrapper">
      <slot />
    </main>
  
    <Footer />
  
  </div>
  
  </template>

<script setup>
import Navbar from "./Navbar.vue"
import Footer from "./Footer.vue"
</script>

<style>
.layout {

  min-height: 100vh;
  width: 100%;

  background-image: url("/background.png");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  background-attachment: fixed;

  display: flex;
  flex-direction:column;

}

.content-wrapper {

  max-width: 900px;
  margin: auto;

  padding: 40px 20px;
  width: 100%;

}

/* 平板设备优化 */
@media (max-width: 900px) {
  .content-wrapper {
    padding: 30px 15px;
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px 12px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 16px 10px;
  }
}
</style>