<script setup>
// 这里是管理员文章管理页
import { ref, computed, onMounted } from "vue"
import api from "../../api"

const posts = ref([])
const total = ref(0)
const page = ref(1)
const pageInput = ref(1)
const limit = ref(10)

const totalPages = computed(() => {
    return Math.max(1, Math.ceil(total.value / limit.value))
})

const loadPosts = async () => {
    try {
        const res = await api.get("/posts", {
            params: {
                page: page.value,
                limit: limit.value
            }
        })

        posts.value = res.data.posts
        total.value = res.data.total
    } catch (err) {
        console.error("加载文章失败", err)
    } finally {
        // 保持输入框与当前页同步
        pageInput.value = page.value
    }
}

const deletePost = async (id) => {
    if (!confirm("删除文章？")) return

    try {
        await api.delete(`/posts/${id}`)

        // 如果当前页是最后一页且删除后当前页空了，则尝试回退一页
        if (posts.value.length === 1 && page.value > 1) {
            page.value -= 1
        }

        loadPosts()
    } catch (err) {
        console.error(err)
        alert("删除失败")
    }
}

const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages.value) return
    page.value = newPage
    loadPosts()
}

const jumpToPage = () => {
    const target = Number(pageInput.value)
    if (Number.isNaN(target)) return
    goToPage(target)
}

onMounted(loadPosts)
</script>

<template>

    <div class="admin">

        <div class="header">
            <h2>文章管理</h2>
            <router-link to="/admin">
                <button class="back-admin-btn">返回后台</button>
            </router-link>
        </div>

        <div v-if="posts.length === 0" class="empty">
            当前暂无文章
        </div>

        <table v-else>
            <thead>
                <tr>
                    <th>标题</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in posts" :key="p._id">
                    <td>{{ p.title }}</td>
                    <td>
                        <router-link :to="'/blog/edit/' + p._id">
                            编辑
                        </router-link>

                        <button @click="deletePost(p._id)">
                            删除
                        </button>
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
                共 {{ totalPages }} 页（{{ total }} 篇）
            </span>

            <button :disabled="page === totalPages" @click="goToPage(page + 1)">下一页</button>
        </div>

    </div>

</template>

<style>
table {

    width: 100%;
    border-collapse: collapse;

}

td,
th {

    padding: 10px;
    border-bottom: 1px solid #ddd;

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

.admin {
    padding: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.header h2 {
    margin: 0;
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

  .header h2 {
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

  td,
  th {
    padding: 8px;
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

  .page-jump span {
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

  .header h2 {
    font-size: 16px;
  }

  .back-admin-btn {
    padding: 6px;
    font-size: 11px;
  }

  table {
    font-size: 11px;
  }

  td,
  th {
    padding: 6px;
  }

  .pagination {
    gap: 4px;
    flex-direction: column;
    margin-top: 10px;
  }

  .pagination button {
    padding: 6px 8px;
    font-size: 11px;
    width: 100%;
  }

  .page-jump {
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
  }

  .page-jump input {
    width: 40px;
    padding: 3px;
    font-size: 11px;
  }

  .pagination span {
    font-size: 10px;
    width: 100%;
  }
}

</style>
