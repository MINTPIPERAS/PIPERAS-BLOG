<script setup>
import { ref } from 'vue';
import router from '../router';
import api from '../api';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { toolbar, codeLanguages } from "../utils/editorConfig"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import GlassCard from '../components/GlassCard.vue';

const title = ref('');
const author = ref('');
const content = ref('');
const coverUrl = ref('');

const submitPost = async () => {
  if (!title.value || !content.value) {
    alert('标题和内容不能为空');
    return;
  }

  try {
    await api.post('/posts', {
      title: title.value,
      author: author.value || '作者',
      content: content.value,
      cover: coverUrl.value,
    });

    alert('发布成功');

    router.push('/admin/posts');  // 发布后返回后台管理页
  } catch (err) {
    console.error(err);
    alert('发布失败');
  }
};

const uploadCover = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const form = new FormData();
  form.append('cover', file);

  const res = await api.post('/posts/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  coverUrl.value = res.data.url;
};

</script>

<template>
  <div class="container">
    <div class="header">
      <h1 style="text-align: center; color: mintcream;">发布文章</h1>
      <router-link to="/admin">
        <button class="back-admin-btn">返回后台</button>
      </router-link>
    </div>

    <label>封面图片</label>
    <input type="file" @change="uploadCover" />

    <div v-if="coverUrl">
      <img :src="'http://8.130.212.252' + coverUrl" style="width:200px;margin-top:10px;" />
    </div>

    <div class="form">
      <label>标题</label>
      <input v-model="title" placeholder="文章标题" />

      <label>作者</label>
      <input v-model="author" placeholder="作者" />

      <label>内容</label>
      <!-- <textarea v-model="content" rows="12" placeholder="写下你的文章内容..."></textarea> -->
      <QuillEditor v-model:content="content" contentType="html" theme="snow" :toolbar="toolbar" class="editor" />
      <!-- <QuillEditor v-model:content="content" contentType="html" theme="snow" :modules="modules" class="editor" /> -->
      <button class="publish" @click="submitPost">发布文章</button>
    </div>
  </div>
</template>

<style>
.container {
  width: 700px;
  margin: auto;
  margin-top: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.form {
  display: flex;
  flex-direction: column;
}

input,
textarea {
  margin: 10px 0;
  padding: 12px;
  font-size: 16px;
}

.publish {
  margin-top: 20px;
  padding: 12px;
  font-size: 18px;
  background-color: #42b983;
  border: none;
  color: white;
  cursor: pointer;
}

.publish:hover {
  opacity: 0.8;
}

.content {
  line-height: 1.8;
  font-size: 16px;
}

.content h1,
.content h2,
.content h3 {
  margin-top: 24px;
}

.content p {
  margin: 12px 0;
}

.content img {
  max-width: 100%;
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
