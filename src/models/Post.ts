import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const slugify = require("slugify");
const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    image: {
      uri: String,
      cloudinary_id: String,
    },
    author: {
      type: ObjectId,
      ref: "Student",
    },
    community: {
      type: ObjectId,
      ref: "Community",
    },
    upvotes: [{ type: ObjectId, ref: "Student" }],
    downvotes: [{ type: ObjectId, ref: "Student" }],
    reports: [{ type: ObjectId, ref: "Student", default: [] }],
    voteCount: {
      type: Number,
      default: 0,
    },
    voteRatio: {
      type: Number,
      default: 0,
    },
    solved: {
      type: Boolean,
      default: false,
    },
    hotAlgo: {
      type: Number,
      default: Date.now,
    },
    controversialAlgo: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
postSchema.virtual("commentCount", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
  count: true,
});

// postSchema.pre("save", function (next: any) {
//   // @ts-ignore
//   this.slug = slugify(this.name, { lower: true, replacement: "" });
//   next();
// });

// Cascade delete comments when a post is deleted
postSchema.pre("remove", async function (next) {
  console.log(`Comments being removed from post`.bgBlue);
  await this.model("Comment").deleteMany({ post: this._id });
  next();
});

postSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.sort("-createdAt");
  this.populate("commentCount");
  next();
});

export const Post = mongoose.model("Post", postSchema);
