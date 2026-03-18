import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({

  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    required:true
  },

  postTitle: { type: String, required: true },  // 新增：文章标题

  author:{
    type:String,
    default:"匿名"
  },

  content:{
    type:String,
    required:true
  }

},{
  timestamps:true
})

export default mongoose.model("Comment",CommentSchema)