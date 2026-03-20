<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { computed } from 'vue'
import api from '../api'

const route = useRoute()
const router = useRouter()
const posts = ref([])
const loading = ref(true)
const page = ref(Number(route.query.page) || 1)
const pageInput = ref(page.value)
const limit = 5
const total = ref(0)

const loadPosts = async () => {
  loading.value = true

  const res = await api.get('/posts', {
    params: {
      page: page.value,
      limit
    }
  })

  posts.value = res.data.posts
  total.value = res.data.total

  loading.value = false
  pageInput.value = page.value
}

// 分页加载文章 2026.03.07 修改
// onMounted(async () => {
//   try {
//     const res = await api.get('/posts')
//     posts.value = res.data
//   } catch (err) {
//     console.error('获取文章失败:', err)
//   } finally {
//     loading.value = false
//   }
// })
onMounted(loadPosts)

const totalPages = computed(() => {
  return Math.ceil(total.value / limit)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const summary = (html) => {
  if (!html) return ''

  // 构建临时 DOM 元素解析 HTML，并提取纯文本内容
  const div = document.createElement('div')
  div.innerHTML = html
  const text = div.textContent || div.innerText || ''

  // 压缩多余空格并截断为预览长度
  const cleanText = text.replace(/\s+/g, ' ').trim()

  return cleanText.length > 120 ? cleanText.slice(0, 120) + '...' : cleanText
}

// 分页组件 2026.03.07 修改
// 依赖重新加载时切换到第一页
const changePage = (newPage) => { // 分页切换函数 2026.03.07 修改

  if (newPage < 1 || newPage > totalPages.value) return

  page.value = newPage
  pageInput.value = newPage

  router.push({
    path: '/blog',
    query: { page: newPage }
  })

  loadPosts()
}

const jumpToPage = () => {
  const target = Number(pageInput.value)
  if (Number.isNaN(target)) return
  changePage(target)
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div>
    <div class="container">

      <div class="header">
        <h1 style="color: whitesmoke;">博客文章</h1>

        <!-- <router-link to="/blog/create">
        <button class="create-btn">发布文章</button>
      </router-link> -->
        <button class="create-btn" @click="scrollToBottom">一键到底</button>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="posts.length === 0" class="empty">
        暂无文章
      </div>

      <div v-else class="post-list">

        <div class="post-card" v-for="post in posts" :key="post._id">

          <img v-if="post.cover" :src="'http://8.130.212.252' + post.cover" class="cover" />

          <div class="post-content">

            <h2 class="title">
              <router-link :to="{ path: '/blog/' + post._id, query: { page } }">
                {{ post.title }}
              </router-link>
            </h2>

            <div class="meta">
              {{ post.author || '作者' }} 于
              {{ formatDate(post.createdAt) }}
            </div>

            <p class="summary">
              {{ summary(post.content) }}
            </p>

            <router-link :to="{ path: '/blog/' + post._id, query: { page } }">
              <button class="read-btn">查看全文</button>
            </router-link>

          </div>

        </div>

      </div>

    </div>

    <div class="pagination" v-if="totalPages > 1">

      <button :disabled="page === 1" @click="changePage(page - 1)">
        上一页
      </button>

      <div class="page-jump">
        <span>第</span>
        <input type="number" min="1" :max="totalPages" v-model.number="pageInput" />
        <span>页</span>
        <button @click="jumpToPage">跳转</button>
      </div>

      <span>
        第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 篇）
      </span>

      <button :disabled="page === totalPages" @click="changePage(page + 1)">
        下一页
      </button>

    </div>
  </div>
</template>

<style>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  border-radius: 17px;

  backdrop-filter: blur(10px);

  background: rgba(255, 255, 255, 0.2);

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-btn {
  padding: 10px 16px;
  background: #42b983;
  border: none;
  color: white;
  cursor: pointer;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: transparent;
}

.post-card {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);

  background: rgba(255, 255, 255, 0.3);

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cover {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.post-content {
  padding: 20px;
}

.title {
  margin-bottom: 8px;
}

.title a {
  text-decoration: none;
  color: #333;
}

.title a:hover {
  color: #42b983;
}

.meta {
  font-size: 14px;
  color: gray;
  margin-bottom: 10px;
}

.summary {
  color: #444;
  line-height: 1.6;
  margin-bottom: 15px;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-btn {
  padding: 8px 14px;
  border: none;
  background: #3498db;
  color: white;
  cursor: pointer;
}

.loading {
  text-align: center;
}

.empty {
  text-align: center;
  color: gray;
}

/*  */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-jump input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-jump button {
  color: black;
}

.pagination button {
  padding: 8px 16px;
  border: none;
  background: #42b983;
  color: black;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>