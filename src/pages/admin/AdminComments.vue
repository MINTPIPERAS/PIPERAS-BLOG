<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api'

const comments = ref([])
const total = ref(0)
const page = ref(1)
const pageInput = ref(1)
const limit = ref(10)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(total.value / limit.value))
})

const loadComments = async () => {
  try {
    const res = await api.get('/comments', {
      params: {
        page: page.value,
        limit: limit.value
      }
    })
    // 假设后端返回 { comments: [...], total: 100 }
    comments.value = res.data.comments
    total.value = res.data.total
  } catch (err) {
    console.error('加载评论失败', err)
  } finally {
    pageInput.value = page.value
  }
}

const deleteComment = async (id) => {
  if (!confirm('确定删除该评论吗？')) return
  try {
    await api.delete(`/comments/${id}`)
    // 如果当前页是最后一页且只有一条评论，则回退一页
    if (comments.value.length === 1 && page.value > 1) {
      page.value -= 1
    }
    loadComments()
  } catch (err) {
    console.error(err)
    alert('删除失败')
  }
}

const goToPage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  loadComments()
}

const jumpToPage = () => {
  const target = Number(pageInput.value)
  if (Number.isNaN(target)) return
  goToPage(target)
}

onMounted(loadComments)
</script>

<template>
  <div class="admin">
    <div class="header">
      <h2>评论管理</h2>
      <router-link to="/admin">
        <button class="back-admin-btn">返回后台</button>
      </router-link>
    </div>

    <div v-if="comments.length === 0" class="empty">
      暂无评论
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>评论内容</th>
          <th>作者</th>
          <th>所属文章</th>
          <th>评论时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in comments" :key="c._id">
          <td>{{ c.content }}</td>
          <td>{{ c.author }}</td>
          <td>
            <router-link :to="'/blog/' + c.postId" target="_blank">
              {{ c.postTitle || '查看文章' }}
            </router-link>
          </td>
          <td>{{ new Date(c.createdAt).toLocaleString() }}</td>
          <td>
            <button @click="deleteComment(c._id)" class="delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page === 1" @click="goToPage(page - 1)">上一页</button>

      <div class="page-jump">
        <span>第</span>
        <input type="number" min="1" :max="totalPages" v-model.number="pageInput" />
        <span>页</span>
        <button @click="jumpToPage">跳转</button>
      </div>

      <span>
        共 {{ totalPages }} 页（{{ total }} 条评论）
      </span>

      <button :disabled="page === totalPages" @click="goToPage(page + 1)">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.admin {
  padding: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:hover {
  opacity: 0.8;
}
.empty {
  padding: 20px;
  color: #666;
  text-align: center;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-jump input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.page-jump button {
  color: black;
}
.pagination button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.back-admin-btn {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  color: #333;
  cursor: pointer;
}
.back-admin-btn:hover {
  background: #ececec;
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .admin {
    padding: 12px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 18px;
  }

  .back-admin-btn {
    width: 100%;
    padding: 8px;
    font-size: 12px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px;
  }

  /* 在移动端隐藏"所属文章"列 */
  th:nth-child(3),
  td:nth-child(3) {
    display: none;
  }

  th:nth-child(4),
  td:nth-child(4) {
    display: none;
  }

  .delete-btn {
    padding: 4px 8px;
    font-size: 11px;
  }

  .empty {
    padding: 16px;
    font-size: 13px;
  }

  .pagination {
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .pagination button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .page-jump {
    gap: 4px;
  }

  .page-jump input {
    width: 50px;
    padding: 4px;
    font-size: 12px;
  }

  .pagination span {
    font-size: 11px;
    flex-basis: 100%;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .admin {
    padding: 10px;
  }

  .header {
    gap: 8px;
  }

  h2 {
    font-size: 16px;
  }

  .back-admin-btn {
    padding: 6px;
    font-size: 11px;
  }

  table {
    font-size: 10px;
  }

  th, td {
    padding: 4px;
  }

  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4) {
    display: none;
  }

  .delete-btn {
    padding: 3px 6px;
    font-size: 10px;
  }

  .pagination {
    gap: 4px;
    flex-direction: column;
    margin-top: 10px;
  }

  .pagination button {
    padding: 6px 8px;
    font-size: 10px;
    width: 100%;
  }

  .page-jump {
    flex-wrap: wrap;
    width: 100%;
    gap: 2px;
  }

  .page-jump input {
    width: 35px;
    padding: 3px;
    font-size: 10px;
  }

  .page-jump span {
    font-size: 10px;
  }

  .pagination span {
    font-size: 9px;
    width: 100%;
  }
}
</style>