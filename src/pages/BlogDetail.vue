<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import { nextTick } from 'vue'
// import GlassCard from '../components/GlassCard.vue';

const route = useRoute();
const router = useRouter();   // 路由实例

const post = ref(null);
const loading = ref(true);

// 评论相关
const comments = ref([])
const commentContent = ref("")
const commentAuthor = ref("")
const showComments = ref(false)

// onMounted(async () => {
//   try {
//     const id = route.params.id;
//     const res = await api.get(`/posts/${id}`);
//     post.value = res.data;

//     // 文章加载完再加载评论
//     await loadComments()

//     await nextTick()

//     document.querySelectorAll(".content pre, .content .ql-code-block").forEach((pre) => {

//       hljs.highlightElement(pre)

//       // 防止重复生成
//       if (pre.parentElement.classList.contains("code-wrapper")) return

//       const wrapper = document.createElement("div")
//       wrapper.className = "code-wrapper"

//       const header = document.createElement("div")
//       header.className = "code-header"

//       const langLabel = document.createElement("span")
//       langLabel.innerText = "code"

//       const copyBtn = document.createElement("button")
//       copyBtn.innerText = "复制"

//       copyBtn.onclick = () => {
//         navigator.clipboard.writeText(pre.innerText)
//         copyBtn.innerText = "已复制"
//         setTimeout(() => copyBtn.innerText = "复制", 1500)
//       }

//       header.appendChild(langLabel)
//       header.appendChild(copyBtn)

//       pre.parentNode.insertBefore(wrapper, pre)
//       wrapper.appendChild(header)
//       wrapper.appendChild(pre)

//     })

//   } catch (err) {
//     console.error('获取文章失败:', err);
//   } finally {
//     loading.value = false;
//   }
// });
// 文章详情页加载完成后，执行代码块包装 上面是旧版本
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await api.get(`/posts/${id}`);
    post.value = res.data;

    await loadComments();
  } catch (err) {
    console.error('获取文章失败:', err);
  } finally {
    loading.value = false;              // 先让文章显示出来
    await nextTick();                    // 等待 DOM 更新
    // 然后执行代码块包装
    document.querySelectorAll(".content pre, .content .ql-code-block").forEach((pre) => {
      hljs.highlightElement(pre);
      if (pre.parentElement.classList.contains("code-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper";

      const header = document.createElement("div");
      header.className = "code-header";

      // 如果你希望显示实际语言，可以尝试从 pre 标签 class 中提取，但这里先用固定文本
      const langLabel = document.createElement("span");
      langLabel.innerText = "code";      // 可根据需要改为检测到的语言
      // let lang = "code"

      // if (pre.querySelector("code")?.className) {
      //   const cls = pre.querySelector("code").className
      //   const match = cls.match(/language-(\w+)/)
      //   if (match) lang = match[1]
      // }

      // // highlight.js 自动识别
      // const result = hljs.highlightAuto(pre.innerText)
      // if (result.language) {
      //   lang = result.language
      // }

      // langLabel.innerText = lang

      const copyBtn = document.createElement("button");
      copyBtn.innerText = "复制";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(pre.innerText);
        copyBtn.innerText = "已复制";
        setTimeout(() => copyBtn.innerText = "复制", 1500);
      };

      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }
});

const deletePost = async () => {
  if (!confirm("确定删除这篇文章吗？")) return;

  try {
    await api.delete(`/posts/${post.value._id}`);
    alert('文章删除成功');
    router.push('/blog');    // 跳转到文章列表
  } catch (err) {
    console.error(err);
    alert('删除文章失败');
  }
};

const submitComment = async () => {

  if (!commentContent.value) {
    alert("评论不能为空")
    return
  }

  await api.post("/comments", {
    postId: post.value._id,
    author: commentAuthor.value || "匿名",
    content: commentContent.value
  })

  commentContent.value = ""

  loadComments()

}

// const loadComments = async () => {

//   const res = await api.get(`/comments/${post.value._id}`)

//   comments.value = res.data

// }
const loadComments = async () => {

  if (!post.value) return

  const res = await api.get(`/comments/${post.value._id}`)

  comments.value = res.data

}

</script>

<template>
  
    <div class="container">
      <div v-if="loading">加载中...</div>

      <div v-else-if="!post">
        <h2>文章不存在</h2>
      </div>

      <div v-else>
        <h1>{{ post.title }}</h1>

        <img v-if="post.cover" :src="post.cover" class="detail-cover" />

        <div class="content" v-html="post.content"></div>

        <p class="meta">
          作者：{{ post.author }} |
          发布时间：{{ new Date(post.createdAt).toLocaleString() }}
          -{{ post.views }} 阅读
        </p>

        <!-- 操作按钮 -->
        <div class="actions">
          <router-link :to="{ path: '/blog', query: { page: route.query.page || 1 } }">
            <button class="back-btn">返回列表</button>
          </router-link>

          <!-- <router-link :to="{ path: '/blog/edit', query: { id: route.params.id } }">
            <button class="edit-btn">编辑文章</button>
          </router-link> -->

          <!-- <button class="delete-btn" @click="deletePost">删除文章</button> -->

          <button class="comment-btn" @click="showComments = !showComments">评论</button>
        </div>

      </div>

      <!-- 评论浮窗 -->
      <div v-if="showComments" class="comment-modal">
        <div class="comment-header">
          <h2>评论</h2>
          <button class="close-btn" @click="showComments = false">X</button>
        </div>

        <div class="comment-form">
          <input v-model="commentAuthor" placeholder="你的名字" />
          <textarea v-model="commentContent" placeholder="写下你的评论..."></textarea>
          <button @click="submitComment">发表评论</button>
        </div>

        <div v-for="c in comments" :key="c._id" class="comment-item">
          <div class="comment-meta">
            <strong>{{ c.author }}</strong>
            <span>{{ new Date(c.createdAt).toLocaleString() }}</span>
          </div>
          <p>{{ c.content }}</p>
        </div>
      </div>

    </div>
  
</template>

<style>
.container {
  width: 700px;
  margin: auto;
  padding: 20px;
  position: relative;
}

.meta {
  font-size: 14px;
  color: gray;
  margin-bottom: 20px;
  max-width: 720px;
  margin: auto;
}

/* .content {
  white-space: pre-wrap;
  font-size: 18px;
  line-height: 1.8;
} */
.content {
  font-size: 18px;
  line-height: 1.8;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  word-break: break-word;
  overflow-wrap: break-word;
}

.actions {
  margin: 20px 0;
}

.back-btn,
.edit-btn,
.delete-btn,
.comment-btn {
  margin-right: 10px;
  padding: 8px 14px;
  cursor: pointer;
  border: none;
}

.back-btn {
  background-color: #e0e0e0;
  color: #333;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.comment-btn {
  background-color: green;
  color: white;
}

.detail-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.comment-modal {
  position: absolute;
  left: 101%;      /* 紧挨着右侧 */
  top: 0;
  width: 320px;        /* 变窄 */
  max-height: 70vh;
  background: white;
  border-radius: 12px; /* 圆角 */
  border: 1px solid rgba(0,0,0,0.1); /* 浅色描边 */
  box-shadow: 0 4px 20px rgba(0,0,0,0.15); /* 可选：增加层次感 */
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

/* .content ul,
.content ol {
  padding-left: 20px;
  margin: 10px 0;
} */

.content ul,
.content ol {
  padding-left: 1.5em;
  margin: 12px 0;
}

.content li {
  margin: 6px 0;
  text-align: left;
}

.content ol {
  list-style: decimal;
}

.content ul {
  list-style: disc;
}

.comment-form input,
.comment-form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

.comment-meta {
  font-size: 14px;
  color: #666;
}

.content pre {
  /* 原有样式保持不变 */
  background: #f6f8fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  /* 保持水平滚动 */
  margin: 20px 0;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  text-align: left;
  font-size: 14px;

  /* 新增：限制最大高度，超出时显示垂直滚动条 */
  max-height: 400px;
  /* 可根据需要调整数值，例如 60vh */
  overflow-y: auto;
  /* 启用垂直滚动 */
}

.content code {
  font-family: "Fira Code", monospace;
  text-align: left;
}

.content pre code {
  display: block;
  text-align: left;
}

.code-wrapper {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #f3f3f3;
  padding: 6px 12px;

  font-size: 13px;
  color: #666;
}

.code-header button {
  border: none;
  background: #409eff;
  color: white;
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.code-header button:hover {
  opacity: 0.8;
}

/* 平板设备优化 */
@media (max-width: 900px) {
  .container {
    width: 100%;
    padding: 16px;
  }

  .content {
    font-size: 16px;
    padding: 16px;
    margin: 16px 0;
  }

  .detail-cover {
    max-height: 300px;
  }

  .comment-modal {
    left: auto;
    right: 0;
    width: 280px;
    max-height: 60vh;
  }
}

/* 移动设备优化 */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 12px;
  }

  h1 {
    font-size: 22px;
    margin: 16px 0 12px 0;
  }

  .meta {
    font-size: 12px;
    margin: 12px 0;
  }

  .content {
    font-size: 14px;
    line-height: 1.6;
    padding: 12px;
    margin: 12px 0;
    border-radius: 6px;
  }

  .detail-cover {
    max-height: 240px;
    margin-bottom: 16px;
  }

  .actions {
    margin: 16px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .back-btn,
  .edit-btn,
  .delete-btn,
  .comment-btn {
    margin-right: 0;
    padding: 6px 10px;
    font-size: 12px;
    flex: 1;
    min-width: 100px;
  }

  .comment-modal {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    max-height: 70vh;
    border-radius: 16px 16px 0 0;
    border: none;
    padding: 16px;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .comment-form input,
  .comment-form textarea {
    padding: 8px;
    font-size: 13px;
    margin: 8px 0;
  }

  .comment-item {
    padding: 10px 0;
  }

  .content pre {
    padding: 12px;
    margin: 12px 0;
    font-size: 12px;
    max-height: 300px;
  }

  .content ul,
  .content ol {
    padding-left: 1.2em;
    margin: 8px 0;
  }

  .content li {
    margin: 4px 0;
  }

  .code-wrapper {
    margin: 12px 0;
  }

  .code-header {
    padding: 4px 8px;
    font-size: 11px;
  }

  .code-header button {
    padding: 2px 8px;
    font-size: 11px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 18px;
    margin: 12px 0 10px 0;
  }

  .meta {
    font-size: 11px;
  }

  .content {
    font-size: 13px;
    padding: 10px;
    margin: 10px 0;
  }

  .detail-cover {
    max-height: 180px;
    margin-bottom: 12px;
  }

  .actions {
    margin: 12px 0;
    gap: 6px;
  }

  .back-btn,
  .edit-btn,
  .delete-btn,
  .comment-btn {
    padding: 5px 8px;
    font-size: 11px;
    min-width: auto;
  }

  .comment-modal {
    padding: 12px;
  }

  .comment-header h2 {
    font-size: 16px;
  }

  .comment-form input,
  .comment-form textarea {
    padding: 6px;
    font-size: 12px;
    margin: 6px 0;
  }

  .comment-form button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .content pre {
    padding: 10px;
    margin: 10px 0;
    font-size: 11px;
    max-height: 250px;
  }

  .content ul,
  .content ol {
    padding-left: 1em;
    margin: 6px 0;
  }

  .content li {
    margin: 3px 0;
  }

  .code-header {
    padding: 3px 6px;
    font-size: 10px;
  }

  .code-header button {
    padding: 2px 6px;
    font-size: 10px;
  }
}
</style>
