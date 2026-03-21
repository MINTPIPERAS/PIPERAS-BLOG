<template>
    <section class="hero-section">
      <h1 class="hero-title" style="color: whitesmoke;">欢迎来到{{ name }}的洞穴</h1>
      <h3 class="hero-subtitle" style="color: mintcream;">沉底的砂糖不会遇见雪国的绿樱桃</h3>
    </section>
  </template>
  
  <script setup>
  const name = 'PIPERAS'
  </script>

  <style>
  .hero-section {
    text-align: center;
    padding: 40px 0;
  }

  .hero-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  /* 平板设备优化 */
  @media (max-width: 900px) {
    .hero-section {
      padding: 30px 0;
    }

    .hero-title {
      font-size: 28px;
    }

    .hero-subtitle {
      font-size: 16px;
    }
  }

  /* 移动设备优化 */
  @media (max-width: 768px) {
    .hero-section {
      padding: 20px 0;
    }

    .hero-title {
      font-size: 22px;
      margin-bottom: 12px;
    }

    .hero-subtitle {
      font-size: 14px;
    }
  }

  /* 超小屏幕优化 */
  @media (max-width: 480px) {
    .hero-section {
      padding: 16px 0;
    }

    .hero-title {
      font-size: 18px;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .hero-subtitle {
      font-size: 12px;
    }
  }
  </style>
  
  <!-- 这个字体不错，我喜欢它-font-family: 'Courier New', Courier, monospace; -->