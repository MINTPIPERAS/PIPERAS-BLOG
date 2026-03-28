# 请求排错速查表（401 / 404 / 500）

这份文档面向当前项目，目标是让你在 1-3 分钟内判断问题在哪一层。

## 0. 先确认你当前是开发环境还是线上环境

开发环境常见组合：

- 前端：Vite（通常 5173）
- 后端：Express（5000）
- 前端请求：走 /api
- Vite 代理：把 /api 转发到 http://localhost:5000

关键文件：

- src/api/index.js
- vite.config.js
- server/index.js

---

## 1. 401 未授权（最常见于后台操作）

### 现象

- 删除文章失败
- 编辑文章失败
- 删除评论失败
- 浏览器 Network 里状态码 401

### 本项目常见原因

1. 没有 token
- 登录后没有成功保存 token
- localStorage 被清空

2. token 没有被带到请求头
- axios 请求拦截器没生效
- 没走统一的 api 实例

3. token 无效或过期
- 后端 auth 校验失败

### 先看哪里

1. src/api/index.js
- 是否从 localStorage 读取 token
- 是否设置 Authorization: Bearer token

2. server/middleware/auth.js
- 是否读取 req.headers.authorization
- 是否用 SECRET_KEY 验签

3. server/routes/posts.js 与 server/routes/comments.js
- 目标接口是否挂了 auth 中间件

### 快速修复建议

- 重新登录一次，确认 localStorage 里有 token
- 确认所有后台请求都用同一个 api 实例发起
- 如果服务端改过密钥，前端旧 token 失效时需要重新登录

---

## 2. 404 接口不存在（路径写错或路由未挂载）

### 现象

- Network 显示 404
- 后端日志没有进入预期路由

### 本项目常见原因

1. 前端请求路径和后端路由不一致
- 例如前端调 /post，后端实际是 /posts

2. 忘了 /api 前缀
- 本项目后端路由都挂在 /api 下

3. 路由顺序或参数路由影响匹配
- 评论路由中 / 和 /:postId 顺序要谨慎

### 先看哪里

1. server/index.js
- 是否有 app.use("/api", authRoutes)
- 是否有 app.use("/api/posts", postsRouter)
- 是否有 app.use("/api/comments", commentRoutes)

2. server/routes/auth.js
3. server/routes/posts.js
4. server/routes/comments.js
5. src/pages 下实际发请求的位置

### 快速修复建议

- 先在 Network 复制 Request URL，和后端路由逐字对照
- 统一用 api.get/post/put/delete + 相对路径写法

---

## 3. 500 服务器错误（后端代码执行异常）

### 现象

- 状态码 500
- 前端只看到“失败”提示
- 后端控制台有堆栈错误

### 本项目常见原因

1. 数据库问题
- MONGO_URI 不正确
- MongoDB 未连接成功

2. 请求体字段不符合后端预期
- 缺少必填字段
- 字段名写错

3. 文件上传问题
- 上传目录权限或路径问题
- multipart/form-data 与后端接收方式不匹配

4. 文件删除问题
- 删除封面时文件不存在或路径不一致

### 先看哪里

1. server/index.js
- mongoose.connect 是否成功

2. server/routes/posts.js
- 上传、创建、编辑、删除逻辑

3. server/routes/comments.js
- 评论创建/删除逻辑

4. server/models/*.js
- 模型字段是否与请求字段一致

### 快速修复建议

- 先看后端终端报错原文，再回到对应路由定位
- 对文件上传接口，确认前端使用 FormData
- 对 JSON 接口，确认请求体字段名与后端解构一致

---

## 4. 一条通用排查路径（推荐固定流程）

1. 先看浏览器 Network
- URL
- Method
- Status
- Response body
- Request headers 是否带 Authorization

2. 再看前端请求发起代码
- 是否用了 src/api/index.js 的实例
- 路径是否正确（如 /posts、/comments）

3. 然后看代理与后端入口
- vite.config.js 的 /api 代理
- server/index.js 的路由挂载

4. 最后看具体路由与中间件
- 是否命中目标路由
- 是否经过 auth
- 是否有 try/catch 错误

---

## 5. 你这个项目最常用的“对照检查点”

- 认证入口：server/routes/auth.js
- token 校验：server/middleware/auth.js
- 文章接口：server/routes/posts.js
- 评论接口：server/routes/comments.js
- axios 实例：src/api/index.js
- 代理配置：vite.config.js

如果你只记住一句话：
先看 Network 的状态码，再按“前端实例 -> 代理 -> 后端挂载 -> 具体路由 -> 中间件”顺序走一遍。
