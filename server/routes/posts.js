import express from 'express';
import Post from '../models/Post.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from "../middleware/auth.js"

const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : '/var/www/uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

// 删除文章
// router.delete('/:id', async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const deleted = await Post.findByIdAndDelete(postId);

//     if (!deleted) {
//       return res.status(404).json({ error: '文章不存在' });
//     }

//     res.json({ message: '文章已删除', post: deleted });
//   } catch (err) {
//     res.status(500).json({ error: '删除文章失败' });
//   }
// });
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 删除封面图片（如果有）
    if (post.cover && post.cover.startsWith('/uploads/')) {
      const filePath = path.join(uploadDir, path.basename(post.cover));
      fs.unlink(filePath, (err) => {
        if (err) console.log('封面删除失败:', err);
      });
    }

    res.json({ message: '文章和封面已删除' });
  } catch (err) {
    res.status(500).json({ error: '删除文章失败' });
  }
});


// 获取所有文章（分页）
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: '服务器错误' });
//   }
// });
router.get('/', async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const skip = (page - 1) * limit

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments()

    res.json({
      posts,
      total
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 上传封面图片
// router.post('/upload', upload.single('cover'), (req, res) => {
//   res.json({
//     url: '/uploads/' + req.file.filename
//   });
// });  ——旧版 有问题：成功上传但是数据库中cover字段为空 无法显示封面
// 创建文章（带封面上传）——修改了 原本的不带封面的创建文章已经删除 防止冲突 —? 这版也有问题? 上传封面后数据库中cover字段为空 无法显示封面

// 改为分两步： 先上传封面图 再创建文章  封面图片上传成功 再将图片url保存到数据库
router.post('/upload', auth, upload.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '未接收到文件' });
  }

  res.json({
    url: '/uploads/' + req.file.filename
  });
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, author, cover } = req.body;

    const newPost = new Post({
      title,
      content,
      author,
      cover
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// // 编辑文章
// router.put('/:id', async (req, res) => {
//   const { title, author, content } = req.body;

//   try {
//     const updated = await Post.findByIdAndUpdate(
//       req.params.id,
//       { title, author, content },
//       { new: true }  // 返回更新后的数据
//     );

//     if (!updated) {
//       return res.status(404).json({ message: '文章不存在' });
//     }

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: '更新文章失败' });
//   }
// });
// 上面是旧版 不能更新封面  下面这版可以更新封面
// 编辑文章（可更新封面）
router.put('/:id', auth, upload.single('cover'), async (req, res) => {
  try {
    const { title, author, content } = req.body;

    const updatedData = {
      title,
      author,
      content,
    };

    // 如果上传了新封面
    if (req.file) {
      updatedData.cover = '/uploads/' + req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json({ message: '更新成功', post: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '更新失败', error: err.message });
  }
});

export default router;
