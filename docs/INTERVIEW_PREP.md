# PIPERAS BLOG 面试准备笔记

## 1. 项目一句话介绍
这是一个前后端分离的个人博客系统。
前端用 Vue 3 + Vite + Vue Router + Axios，后端用 Node.js + Express + MongoDB + Mongoose。
系统支持文章浏览、分页、富文本发布、封面上传、评论、管理员登录、文章管理和评论管理。

## 2. 整体架构
### 前端
- 入口：`src/main.js`
- 根组件：`src/App.vue`
- 全局布局：`src/components/Layout.vue`
- 导航与页脚：`src/components/Navbar.vue`、`src/components/Footer.vue`
- 页面路由：`src/router/index.js`
- API 封装：`src/api/index.js`

### 后端
- 服务入口：`server/index.js`
- 路由：`server/routes/auth.js`、`server/routes/posts.js`、`server/routes/comments.js`
- 认证中间件：`server/middleware/auth.js`
- 数据模型：`server/models/User.js`、`server/models/Post.js`、`server/models/Comment.js`

### 通信方式
- 普通数据请求：REST API + JSON
- 图片上传：`multipart/form-data`
- 前端统一通过 Axios 实例请求，自动附带 token

## 3. 数据模型
### Post
字段：`title`、`content`、`author`、`cover`、`views`、`createdAt`、`updatedAt`

设计点：
- `title` 和 `content` 必填
- `cover` 用字符串保存图片 URL
- `views` 用于阅读量统计
- `timestamps` 方便展示发布时间

### Comment
字段：`postId`、`postTitle`、`author`、`content`、`createdAt`、`updatedAt`

设计点：
- `postId` 关联文章
- `postTitle` 是冗余字段，便于后台直接展示所属文章标题
- 评论列表可以按文章维度查询，也可以后台分页管理

### User
字段：`username`、`password`

设计点：
- 当前主要用于管理员登录
- 密码是 hash 后存储，不直接保存明文

## 4. 后端核心设计逻辑
### 4.1 启动流程
`server/index.js` 完成以下工作：
- 读取环境变量
- 启动 Express
- 开启跨域、JSON 解析、URL 编码解析
- 挂载 auth、comments、posts 路由
- 静态暴露上传目录
- 连接 MongoDB 后再启动服务

### 4.2 管理员初始化
服务启动时会执行 `createAdmin()`：
- 先检查是否存在管理员用户
- 如果不存在，则创建默认管理员
- 密码使用 `bcrypt` 生成 hash

面试可以这样说：
“项目为了方便首次部署，启动时做了管理员兜底初始化，避免数据库为空时无法登录后台。”

### 4.3 JWT 认证
- 登录成功后返回 JWT token
- 前端把 token 存到 `localStorage`
- `src/api/index.js` 的拦截器会自动把 token 放到请求头
- `server/middleware/auth.js` 验证 token 后放行

这套设计的优点：
- 前后端解耦
- 登录状态不依赖服务端 session
- 适合小型管理后台

## 5. 重点接口与功能实现
### 5.1 文章列表分页
- 后端：`GET /api/posts?page=&limit=`
- 返回：文章数组 + 总数
- 前端：`src/pages/Blog.vue` 和 `src/pages/admin/AdminPosts.vue` 都使用分页

设计逻辑：
- 前端只请求当前页数据，避免一次加载全部文章
- 后端用 `skip + limit` 控制分页
- `total` 用于计算总页数

### 5.2 文章详情与阅读量
- 后端：`GET /api/posts/:id`
- 查文章时顺便执行 `views + 1`
- 前端在 `src/pages/BlogDetail.vue` 展示阅读数

可面试表达为：
“详情页不是纯查询，而是一个轻量的行为统计入口，浏览即累加阅读量。”

### 5.3 评论系统
- 发布评论：`POST /api/comments`
- 查询文章评论：`GET /api/comments/:postId`
- 后台评论管理：`GET /api/comments`、`DELETE /api/comments/:id`

前端在 `BlogDetail.vue` 用弹窗形式承载评论：
- 先显示文章主体
- 点击“评论”再展开评论区
- 评论提交后重新拉取列表

设计逻辑：
- 评论与文章详情分离，避免首屏过重
- 评论管理与前台展示共用同一数据模型

### 5.4 富文本编辑器
- 文章创建/编辑使用 `@vueup/vue-quill`
- 工具栏配置在 `src/utils/editorConfig.js`
- 内容以 HTML 存储到数据库

前端优势：
- 可直接输入富文本
- 支持标题、加粗、列表、引用、代码块、图片、链接等
- 适合博客类内容展示

面试时可以补一句：
“我选择把内容存成 HTML，是因为博客场景更重展示一致性，编辑和渲染都更直接。”

### 5.5 封面上传
当前实现是“两步走”：
1. 先调用 `POST /api/posts/upload`
2. 拿到返回的 `url` 再创建或更新文章

设计逻辑：
- 图片和文章内容解耦
- 避免一次表单提交里图片没上传成功导致整篇文章失败
- 编辑文章时如果用户没传新封面，就保留旧封面

### 5.6 文章增删改
- 创建：`POST /api/posts`
- 更新：`PUT /api/posts/:id`
- 删除：`DELETE /api/posts/:id`

实现亮点：
- 编辑时支持可选封面更新
- 删除文章时会顺带尝试删除封面文件
- 删除和编辑都需要 token 认证

### 5.7 管理后台
前端后台页包括：
- `AdminLogin.vue`：登录拿 token
- `AdminDashboard.vue`：入口面板
- `AdminPosts.vue`：文章管理
- `AdminComments.vue`：评论管理

路由守卫在 `src/router/index.js`：
- `/admin` 开头的页面未登录时跳转到 `/admin/login`
- 登录后才能进入后台

## 6. 前端设计逻辑
### 6.1 路由结构
- `/` 首页
- `/blog` 博客列表
- `/blog/:id` 文章详情
- `/blog/create` 发布文章
- `/blog/edit/:id` 编辑文章
- `/admin/*` 后台管理

这种路由拆分让用户访问路径非常清晰：
- 访客看内容
- 管理员做增删改

### 6.2 全局布局
`Layout.vue` 负责统一：
- 背景图
- 顶部导航
- 内容区居中
- 页脚

`App.vue` 负责：
- 路由切换动画
- 雪花特效
- 全局包裹布局

这说明项目不仅关注功能，也注重整体视觉风格和页面节奏感。

### 6.3 API 封装
`src/api/index.js` 做了两件关键事：
- 统一 baseURL
- 自动附带 token

这样页面里不用重复写认证逻辑，组件只关注自己的业务动作。

## 7. 可以重点讲的“设计思路”
### 7.1 前后端分离
- 前端负责页面、交互、状态管理
- 后端负责数据校验、权限控制、文件存储和持久化

### 7.2 功能分层
- 公共浏览端：主页、博客列表、详情、项目、联系
- 管理端：登录、文章管理、评论管理
- API 层：统一封装请求
- 数据层：MongoDB + Mongoose

### 7.3 性能与体验
- 列表分页，避免一次性加载过多数据
- 详情页按需加载评论
- 编辑器和代码高亮提升内容表达能力
- 移动端做了响应式优化

### 7.4 内容展示优先
- 博客内容用富文本
- 代码块在详情页会做高亮包装和复制按钮
- 封面图增强文章可读性

## 8. 面试常见问答
### Q1. 你这个项目最大的亮点是什么？
答：我做的是一个完整的前后端分离博客系统，不只是展示页面，还包含登录认证、文章发布、封面上传、评论、后台管理和分页等完整链路。

### Q2. 为什么文章内容用 Quill 富文本编辑器？
答：博客场景对排版展示要求高，富文本比纯 textarea 更适合内容创作，也更方便做标题、列表、代码块和图片展示。

### Q3. token 放在哪里？怎么鉴权？
答：登录后把 token 存到 `localStorage`，Axios 拦截器自动带上 `Authorization: Bearer ...`，后端中间件统一校验。

### Q4. 为什么评论区是弹窗？
答：这样详情页首屏更简洁，评论属于次级交互，点击后再展开可以减少视觉干扰。

### Q5. 为什么封面要先上传再创建文章？
答：因为图片上传和文章保存属于两个不同的失败点。拆开后更清晰，也更方便编辑时复用旧封面。

### Q6. 文章详情为什么会增加阅读量？
答：这是一个自然的行为统计方式，用户访问详情即视为阅读一次，简单直接。

### Q7. 后台怎么防止未登录用户进入？
答：用路由守卫拦截 `/admin` 路径，没 token 就跳转登录页。

### Q8. 评论删除为什么要加权限？
答：评论删除属于后台管理能力，不能开放给所有访客，所以需要 token 校验。

## 9. 可以主动提的不足与改进
### 已知问题
- 上传目录与静态目录要保持一致，否则会出现图片能传但页面读不到的问题
- 当前管理员体系比较简单，缺少角色权限和 token 刷新机制
- 缺少更完整的表单校验和输入过滤

### 可优化方向
- 统一上传路径并支持环境变量配置
- 给文章和评论加更严格的校验
- 给富文本内容增加 XSS 防护思路
- 给后台增加角色权限控制
- 将“管理员登录后手动跳转”升级成更完整的登录状态管理

## 10. 面试时的 30 秒总结稿
“这个项目是一个 Vue + Express + MongoDB 的前后端分离博客系统。前端负责博客列表、详情、富文本发布、封面上传和后台管理，后端负责文章、评论、登录认证和文件存储。我的重点设计是把文章内容、评论、认证和图片上传拆成独立链路，同时通过 Axios 拦截器和 JWT 完成统一鉴权。整个项目既能展示页面能力，也能体现完整业务闭环。”
