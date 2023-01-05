import mongoose from 'mongoose'
// @ts-ignore
const { ObjectId } = mongoose.Schema;

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      uri: {
        type: String,
        required: false,
        default:
          "https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010__340.jpg",
      },
      cloudinary_id: String,
    },
    guidelines: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: ObjectId, //
      ref: "Student",
    },
    admins: [{ type: ObjectId, ref: "Student" }],
    members: [
      {
        type: ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

communitySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "community",
  justOne: false,
});
communitySchema.pre(/^find/, function(){
  console.log('pre community find')
  // this.populate('createdBy', 'avatar firstName lastName')
})
export const Community = mongoose.model("Community", communitySchema);
