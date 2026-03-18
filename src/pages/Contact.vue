<template>
  <div class="container">
    <div class="header">
      <h1 style="color: mintcream; text-align: center;">联系我</h1>
    </div>

    <GlassCard class="intro-card">
      <p>你好，我是PIPERAS，一名XMU树莓人</p>
      <p>PS：树莓 = 数字媒体技术</p>
      <p>会些前端开发，会点建模渲染，混迹Type-Moon圈</p>
      <p>如果你有任何问题或合作机会，欢迎通过以下方式联系我：</p>
      <ul>
        <li>Email: 37220232203794@xmu.edu.cn</li>
        <li>Gmail: cangzhiyue9@gmail.com</li>
        <li>GitHub: <a href="https://github.com/MINTPIPERAS" target="_blank">MINTPIPERAS</a></li>
        <li>Bilibili: <a href="https://space.bilibili.com/1169823633" target="_blank">番茄味Yes番茄No</a></li>
      </ul>
    </GlassCard>
  </div>
</template>

<script setup>
import GlassCard from '../components/GlassCard.vue';
</script>

<style>
.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  /* 内容居中，颜色为淡白色 */
  text-align: center;
}

.header h1 {
  margin: 0;
}

.intro-card {
  padding: 20px;
}

.intro-card h2 {
  margin-top: 0;
  color: #333;
}

.intro-card p {
  line-height: 1.6;
  color: #555;
}

.intro-card ul {
  list-style-type: none;
  padding: 0;
}

.intro-card li {
  margin-bottom: 8px;
}

.intro-card a {
  color: #42b983;
  text-decoration: none;
}

.intro-card a:hover {
  text-decoration: underline;
}
</style>
