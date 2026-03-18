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

}
</style>