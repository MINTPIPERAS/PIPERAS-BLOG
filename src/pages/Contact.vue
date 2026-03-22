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
        <li>Qmail: 1498205907@qq.com</li>
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
  width: 100%;
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
  font-size: 28px;
}

.intro-card {
  padding: 20px;
  font-size: 14px;
}

.intro-card h2 {
  margin-top: 0;
  color: #333;
}

.intro-card p {
  line-height: 1.6;
  color: #555;
  margin-bottom: 10px;
}

.intro-card ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 0;
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

/* 平板设备优化 */
@media (max-width: 900px) {
  .container {
    padding: 16px;
  }

  .header h1 {
    font-size: 24px;
  }

  .intro-card {
    padding: 16px;
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .container {
    padding: 12px;
  }

  .header {
    margin-bottom: 16px;
  }

  .header h1 {
    font-size: 20px;
  }

  .intro-card {
    padding: 14px;
    font-size: 13px;
  }

  .intro-card p {
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .intro-card li {
    margin-bottom: 6px;
    font-size: 12px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .header h1 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .intro-card {
    padding: 12px;
    font-size: 12px;
  }

  .intro-card p {
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .intro-card li {
    margin-bottom: 5px;
    font-size: 11px;
  }
}
</style>
