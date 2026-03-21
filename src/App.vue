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

  <!-- 雪花容器 -->
  <div id="snow-container"></div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { RouterView } from 'vue-router'
import Layout from "./components/Layout.vue"
import { onMounted, onUnmounted } from 'vue'

// 雪花特效相关变量
let snowContainer = null
let mouseTimeout = null
let snowflakes = []

// 创建雪花
const createSnowflake = (x, y) => {
  const snowflake = document.createElement('div')
  snowflake.className = 'snowflake'
  snowflake.style.left = x + 'px'
  snowflake.style.top = y + 'px'

  // 随机雪花大小和透明度
  const size = Math.random() * 8 + 4 // 4-12px
  const opacity = Math.random() * 0.6 + 0.4 // 0.4-1.0

  snowflake.style.width = size + 'px'
  snowflake.style.height = size + 'px'
  snowflake.style.opacity = opacity

  // 随机水平偏移
  const horizontalOffset = (Math.random() - 0.5) * 100 // -50到50px
  snowflake.style.setProperty('--horizontal-offset', horizontalOffset + 'px')

  snowContainer.appendChild(snowflake)
  snowflakes.push(snowflake)

  // 雪花生命周期
  setTimeout(() => {
    snowflake.remove()
    snowflakes = snowflakes.filter(s => s !== snowflake)
  }, 2000) // 2秒后消失
}

// 鼠标移动处理
const handleMouseMove = (e) => {
  // 清除之前的定时器
  if (mouseTimeout) {
    clearTimeout(mouseTimeout)
  }

  // 立即创建雪花
  createSnowflake(e.clientX, e.clientY)

  // 设置新的定时器，如果鼠标停止移动则停止创建雪花
  mouseTimeout = setTimeout(() => {
    // 鼠标停止移动，不创建雪花
  }, 100) // 100ms内没有移动就停止
}

// 组件挂载时添加事件监听
onMounted(() => {
  snowContainer = document.getElementById('snow-container')
  document.addEventListener('mousemove', handleMouseMove)
})

// 组件卸载时清理
onUnmounted(() => {
  if (mouseTimeout) {
    clearTimeout(mouseTimeout)
  }
  document.removeEventListener('mousemove', handleMouseMove)

  // 清理所有雪花
  snowflakes.forEach(snowflake => snowflake.remove())
  snowflakes = []
})
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

/* 雪花特效样式 */
#snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  animation: snowfall 3s linear forwards;
  pointer-events: none;
}

.snowflake::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

@keyframes snowfall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  10% {
    transform: translateY(20px) translateX(var(--horizontal-offset)) rotate(36deg);
  }
  20% {
    transform: translateY(40px) translateX(calc(var(--horizontal-offset) * 0.8)) rotate(72deg);
  }
  30% {
    transform: translateY(60px) translateX(calc(var(--horizontal-offset) * 0.6)) rotate(108deg);
  }
  40% {
    transform: translateY(80px) translateX(calc(var(--horizontal-offset) * 0.4)) rotate(144deg);
  }
  50% {
    transform: translateY(100px) translateX(calc(var(--horizontal-offset) * 0.2)) rotate(180deg);
  }
  60% {
    transform: translateY(120px) translateX(0px) rotate(216deg);
  }
  70% {
    transform: translateY(140px) translateX(calc(var(--horizontal-offset) * -0.2)) rotate(252deg);
  }
  80% {
    transform: translateY(160px) translateX(calc(var(--horizontal-offset) * -0.4)) rotate(288deg);
  }
  90% {
    transform: translateY(180px) translateX(calc(var(--horizontal-offset) * -0.6)) rotate(324deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(200px) translateX(calc(var(--horizontal-offset) * -0.8)) rotate(360deg);
    opacity: 0;
  }
}

/* 移动端优化 - 减少雪花数量和大小 */
@media (max-width: 768px) {
  .snowflake {
    animation-duration: 2s;
  }

  @keyframes snowfall {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg);
      opacity: 0.8;
    }
    50% {
      transform: translateY(80px) translateX(var(--horizontal-offset)) rotate(180deg);
    }
    100% {
      transform: translateY(120px) translateX(calc(var(--horizontal-offset) * 0.5)) rotate(360deg);
      opacity: 0;
    }
  }
}
</style>
