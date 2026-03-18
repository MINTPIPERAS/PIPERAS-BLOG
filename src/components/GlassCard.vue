<template>

  <div class="glass-card">
    <slot />
  </div>

</template>

<style>
.glass-card {

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  background: rgba(255, 255, 255, 0.75);

  border-radius: 16px;

  padding: 30px;

  box-shadow:

    0 10px 30px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.1);

}
</style>