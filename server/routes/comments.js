import express from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// 获取所有评论（分页，用于后台管理）- 放在最前面
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments();

    res.json({ comments, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 发布评论 - 放在通用路由之后，参数路由之前
router.post("/", async (req, res) => {
  try {
    const { postId, author, content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "文章不存在" });
    }

    const comment = new Comment({
      postId,
      postTitle: post.title,
      author,
      content
    });

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取指定文章的评论（参数路由放在后面）
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除评论（需要认证）
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "评论不存在" });
    }
    res.json({ message: "删除成功" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;