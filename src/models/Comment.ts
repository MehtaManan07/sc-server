import mongoose from 'mongoose';
// @ts-ignore
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Comment cannot be empty"],
  },
  user: {
    type: ObjectId,
    ref: "Student",
    required: [true, "Comment must belong to a user"],
  },
  post: {
    type: ObjectId,
    ref: "Post",
    required: [true, "Comment must belong to a post"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: ObjectId, ref: "Student" }],
});

commentSchema.pre(/^find/, function (next: any) {
  // @ts-ignore
  this.populate("user", "firstName username lastName avatar");
  // @ts-ignore
  this.sort("-createdAt");
  next();
});

export const Comment = mongoose.model("Comment", commentSchema);
