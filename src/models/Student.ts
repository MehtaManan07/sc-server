import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
import jwt from "jsonwebtoken";
import { keys } from "../config/keys";
const studentSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    avatar: {
      uri: String,
      cloudinary_id: String,
    },
    bio: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    karmaPoints: {
      type: Number,
      default: 0,
    },
    firebaseToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "educator"],
      default: "student",
    },
    communities: [{ type: String, default: [] }],
    savedPosts: [{ type: ObjectId, ref: "Post", default: [] }],
    followers: [{ type: ObjectId, ref: "Student" }],
    following: [{ type: ObjectId, ref: "Student" }],
    reports: [{ type: ObjectId, ref: "Student" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual populate
studentSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

// Virtual populate
studentSchema.virtual("notifications", {
  ref: "Notification",
  foreignField: "to",
  localField: "_id",
});

// Sign JWT and return;
studentSchema.methods.getSignedJwtToken = function () {
  console.log(keys.JWT_SECRET);
  return jwt.sign({ id: this._id }, keys.JWT_SECRET, {
    expiresIn: "365d",
  });
};

export const Student = mongoose.model("Student", studentSchema);
