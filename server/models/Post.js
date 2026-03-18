import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    cover: { type: String, default: '' },
    views: {
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
