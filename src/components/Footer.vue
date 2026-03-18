<!-- <template>
    <footer class="text-center text-gray-500 py-6 border-t mt-10">
      © {{ year }} {{ name }} | Built with Vue 3
    </footer>
  </template>
  
  <script setup>
  const year = new Date().getFullYear()
  const name = 'PIPERAS'
  </script>
   -->

<template>
  <footer class="footer">
    © {{ year }} {{ name }} | Built with Vue 3
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
const name = 'PIPERAS'
</script>

<style>
.footer {

  width: 100%;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  background: rgba(255, 255, 255, 0.7);

  border-top: 1px solid rgba(255, 255, 255, 0.3);

  padding: 16px 30px;

  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);

}

.footer-content {

  max-width: 900px;

  margin: auto;

  display: flex;

  justify-content: space-between;

  align-items: center;

  font-size: 14px;

  color: #333;

}
</style>