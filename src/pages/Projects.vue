<template>
  <div class="container">
    <div class="header">
      <h1 style="color: whitesmoke;">项目展示</h1>
    </div>

    <div class="project-list">
      <div class="project-card" v-for="item in projects" :key="item.id">
        <div class="project-content">
          <h2 class="title">
            <router-link v-if="item.url && item.url.startsWith('/')" :to="item.url">{{ item.name }}</router-link>
            <a v-else-if="item.url" :href="item.url" target="_blank">{{ item.name }}</a>
            <span v-else>{{ item.name }}</span>
          </h2>
          <p class="desc" v-if="item.desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GlassCard from '../components/GlassCard.vue';

const projects = ref([
  { id: 1, name: '个人网站', desc: '基于 Vue + Vite 的个人站点', url: '/' },
  { id: 2, name: '课程设计', desc: '课程相关项目与作业', url: 'https://github.com/MINTPIPERAS' },
  { id: 3, name: '业余分享', desc: 'Bilibili碎碎念', url: 'https://space.bilibili.com/1169823633?spm_id_from=333.1007.0.0' }
])
</script>

<style>
.container {
  max-width: 900px;
  min-width: 500px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-card {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  background-color: rgba(241, 251, 246, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.project-content {
  padding: 20px;
}

.project-content .title {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #333;
}

.project-content .desc {
  margin: 0;
  color: #444;
  line-height: 1.6;
  font-size: 14px;
}
</style>
