<template>
    <header class="bg-gray-100 py-4 shadow-md">
      <nav class="flex justify-center gap-6 text-lg">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/blog">博客</RouterLink>
        <RouterLink to="/projects">项目</RouterLink>
        <RouterLink to="/contact">联系</RouterLink>
      </nav>
    </header>
  </template>

  <!-- 备注：3-12，该组件废弃，因为Navbar组件已经实现了相同的功能 -->
  
  <script setup>
  import { RouterLink } from 'vue-router'
  </script>
  