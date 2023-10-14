import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "No comment given.",
    required: true,
  },
  datestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  ISBN: {
    type: Number,
    required: true,
    unique: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export { Comment, commentSchema };
