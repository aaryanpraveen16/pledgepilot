import mongoose from "mongoose";

const Schema = mongoose.Schema
const CommentSchema = new Schema({
  content: {
      type: String,
      required: true
  },
  author: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true 
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  likes: { 
      type: Number, 
      default: 0 
  },
  // Add replies to comments
  replies: [{
      content: {
          type: String,
          required: true
      },
      author: { 
          type: Schema.Types.ObjectId, 
          ref: "User",
          required: true 
      },
      createdAt: {
          type: Date,
          default: Date.now
      },
      likes: { 
          type: Number, 
          default: 0 
      }
  }]
});
export default CommentSchema;
