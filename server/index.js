import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRouter from './routes/posts.js';
import commentRoutes from "./routes/comments.js"
import User from "./models/User.js"
import bcrypt from "bcryptjs"
import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function createAdmin(){

  const exists = await User.findOne({username:"admin"})

  if(!exists){

    const hash = await bcrypt.hash("123456",10)

    await User.create({
      username:"PIPERAS",
      password:hash
    })

    console.log("管理员创建成功")
  }

}

createAdmin()

app.use(express.json())

app.use("/api",authRoutes)

// 挂载评论路由
app.use("/api/comments",commentRoutes)

// 静态文件服务（上传的图片）
app.use('/uploads', express.static('uploads'));

// 挂载文章路由
app.use('/api/posts', postsRouter);

// 测试路由（可删除）
app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务器已启动！MongoDB 状态正常！' });
});

// 连接 MongoDB + 启动服务器
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB 连接成功！');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB 连接失败：', err);
});