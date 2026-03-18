<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { toolbar } from "../utils/editorConfig"

const route = useRoute()
const router = useRouter()

const id = route.params.id

const title = ref('')
const author = ref('')
const content = ref('')
const oldCover = ref('')
const newCover = ref(null)

const loading = ref(true)

const modules = {
  syntax: {
    highlight: text => hljs.highlightAuto(text).value
  }
}

/* 加载文章 */
const loadPost = async () => {
  try {
    const res = await api.get(`/posts/${id}`)

    title.value = res.data.title
    author.value = res.data.author
    content.value = res.data.content
    oldCover.value = res.data.cover

  } catch (err) {
    console.error('无法加载文章:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadPost)

/* 选择封面 */
const uploadNewCover = (e) => {
  newCover.value = e.target.files[0]
}

/* 更新文章 */
const updatePost = async () => {

  const form = new FormData()

  form.append('title', title.value)
  form.append('author', author.value)
  form.append('content', content.value)

  if (newCover.value) {
    form.append('cover', newCover.value)
  }

  try {

    await api.put(`/posts/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('更新成功')

    router.push('/admin/posts')

  } catch (err) {

    console.error(err)
    alert('更新失败')

  }

}
</script>

<template>
  <div class="container">

    <h1>编辑文章</h1>

    <div v-if="loading">
      加载中...
    </div>

    <div v-else>

      <label>标题</label>
      <input v-model="title" class="input" />

      <label>作者</label>
      <input v-model="author" class="input" />

      <label>文章内容</label>

      <QuillEditor v-model:content="content" contentType="html" theme="snow" :toolbar="toolbar" class="editor" />

      <label>当前封面</label>

      <div v-if="oldCover" class="cover-preview">
        <img :src="'http://localhost:5000' + oldCover" />
      </div>

      <label>上传新封面（可选）</label>
      <input type="file" @change="uploadNewCover" />

      <button class="save-btn" @click="updatePost">
          保存修改
      </button>

    </div>

  </div>
</template>

<style>
.container {
  max-width: 720px;
  margin: auto;
  padding: 20px;
}

.input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
}

label {
  font-weight: 600;
  margin-top: 20px;
  display: block;
}

.cover-preview img {
  width: 200px;
  border-radius: 8px;
  margin: 10px 0;
}

.save-btn {
  margin-top: 20px;
  padding: 10px 18px;
  font-size: 16px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.save-btn:hover {
  opacity: 0.85;
}

.editor {
  height: 320px;
  margin-top: 10px;
}

.ql-editor {
  font-size: 16px;
  line-height: 1.8;
  background: white;
  padding: 10px;
  border-radius: 4px;
}

.ql-editor pre {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
}

.ql-editor img {
  max-width: 100%;
}
</style>