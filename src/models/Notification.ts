import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    to: {
      type: ObjectId,
      ref: "Student",
    },
    from: {
      type: ObjectId,
      ref: "Student",
    },
    navigate: {
      type: String,
      required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

notificationSchema.index({"expire_at": 1 }, { expireAfterSeconds: 3600 * 24 * 7 * 10 } );
// Cascade delete comments when a post is deleted
notificationSchema.pre("remove", async function (next) {
  //   console.log(`Comments being removed from post`.bgBlue);
  //   await this.model("Comment").deleteMany({ post: this._id });
  next();
});

notificationSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.sort("-createdAt");
  this.populate("from",'avatar');
  next();
});

export const Notification = mongoose.model("Notification", notificationSchema);