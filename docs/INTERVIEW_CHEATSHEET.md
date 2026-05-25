# PIPERAS BLOG 面试速记版

## 1. 30 秒项目介绍
这是一个前后端分离的个人博客系统。
前端使用 Vue 3 + Vite + Vue Router + Axios，后端使用 Node.js + Express + MongoDB + Mongoose。
项目支持文章列表分页、文章详情、富文本发布、封面上传、评论、管理员登录、文章管理和评论管理。

## 2. 我最值得讲的两个亮点
### 亮点一：统一认证链路
- 登录成功后返回 JWT token
- 前端存到 `localStorage`
- Axios 请求拦截器自动带上 `Authorization`
- 后端 `auth` 中间件统一验 token

### 亮点二：内容发布链路完整
- Quill 富文本编辑器写文章
- 封面图片先上传，再把 URL 写入文章数据
- 详情页渲染 HTML，并做代码高亮和复制按钮
- 评论支持前台发布、后台管理

## 3. 技术架构图式理解
### 前端
- `src/main.js`：入口
- `src/App.vue`：全局布局、过渡动画、雪花特效
- `src/router/index.js`：路由与后台守卫
- `src/api/index.js`：Axios 封装和 token 注入
- `src/pages/*`：各业务页面

### 后端
- `server/index.js`：启动、路由挂载、MongoDB 连接、静态资源服务
- `server/routes/posts.js`：文章 CRUD 和封面上传
- `server/routes/comments.js`：评论增删查
- `server/routes/auth.js`：登录签发 JWT
- `server/middleware/auth.js`：token 校验

## 4. 核心数据模型
### Post
- `title`：标题
- `content`：正文 HTML
- `author`：作者
- `cover`：封面 URL
- `views`：阅读量
- `timestamps`：发布时间和更新时间

### Comment
- `postId`：关联文章
- `postTitle`：冗余标题，方便后台展示
- `author`：评论者
- `content`：评论内容

### User
- `username`
- `password`（hash 后保存）

## 5. 核心接口怎么说
### 文章
- `GET /api/posts`：分页文章列表
- `GET /api/posts/:id`：文章详情，顺便 `views + 1`
- `POST /api/posts`：创建文章，需要 token
- `PUT /api/posts/:id`：编辑文章，可更新封面，需要 token
- `DELETE /api/posts/:id`：删除文章，需要 token
- `POST /api/posts/upload`：上传封面，需要 token

### 评论
- `GET /api/comments/:postId`：某篇文章的评论
- `POST /api/comments`：发布评论
- `GET /api/comments`：后台评论分页
- `DELETE /api/comments/:id`：删除评论，需要 token

### 认证
- `POST /api/login`：登录换 token

## 6. 页面功能怎么讲
### 公开端
- 首页：欢迎语和站点氛围
- 博客列表：分页、摘要、封面、跳页
- 详情页：富文本渲染、阅读量、评论弹窗、代码高亮
- 项目页：项目外链和站内链接
- 联系页：个人联系方式展示

### 管理端
- 登录页：用户名密码登录
- 后台首页：管理入口
- 文章管理：分页、编辑、删除
- 评论管理：分页、删除、跳转文章
- 发布页：富文本 + 封面上传 + 提交
- 编辑页：回填旧数据，可选更新封面

## 7. 设计逻辑关键词
- 前后端分离
- JWT 无状态认证
- Axios 拦截器统一注入 token
- 分页加载，避免一次性拉全量数据
- 封面与文章分步处理，减少耦合
- 富文本内容以 HTML 保存，方便直接渲染
- 后台守卫控制权限
- 评论和文章分开管理

## 8. 面试高频问答
### 问：为什么你把封面上传拆成两步？
答：图片上传和文章创建是两个独立失败点，拆开后更容易处理错误，也方便编辑时复用旧封面。

### 问：为什么文章内容存 HTML？
答：博客场景更重展示效果，HTML 可以直接渲染，和富文本编辑器天然匹配。

### 问：token 怎么传递？
答：登录后保存在 `localStorage`，Axios 请求拦截器自动带到请求头，后端中间件统一校验。

### 问：阅读量为什么放在详情接口里加一？
答：用户每次打开详情页都算一次阅读，逻辑简单直接。

### 问：为什么评论管理和文章管理都做了分页？
答：避免后台一次加载过多数据，也方便大数据量下的操作体验。

## 9. 可以主动说的不足
- 上传目录和静态目录最好统一配置，否则部署后容易出图片路径问题
- 当前权限系统比较轻量，适合个人站，不适合复杂多角色场景
- 富文本内容需要注意 XSS 风险
- 没有做 token 刷新机制

## 10. 30 秒结束陈述
“这个项目是一个完整的 Vue + Express + MongoDB 博客系统。我负责了前台内容浏览、富文本发布、封面上传、评论系统和后台管理整套链路。技术上重点用了 JWT 鉴权、Axios 拦截器、分页查询和富文本编辑器，也处理了文章详情阅读量和代码高亮这些细节，整体上比较完整地体现了前后端分离项目的设计与实现。”
