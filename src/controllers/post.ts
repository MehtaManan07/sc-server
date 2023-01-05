import { Community } from "../models/Community";
import { Student } from "../models/Student";
import { Post } from "../models/Post";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../middlewares/ErrorResponse";
import { getUrl, deleteImage } from "../utils/cloudinary";
import {
  downVote,
  generalGetOne,
  upVote,
  tempLike,
  tempUnLike,
} from "../utils/factoryFunctions";

// @ts-ignore
export const createPost = asyncHandler(async (req, res, next) => {
  // community, description
  req.body.author = req.user._id;
  if (req.file) {
    req.body.image = await getUrl(req.file.path);
  }
  if (!req.body.community) {
    return next(new ErrorResponse("Please select a community", 400));
  }
  if (!req.file && !req.body.description) {
    return next(new ErrorResponse("Both image and Text can't be empty", 400));
  }
  if (req.body.description) {
    if (req.body.description.length < 5) {
      return next(new ErrorResponse("Text cannot be this short", 400));
    }
  }
  let post = await Post.create(req.body);
  if (!post) {
    await deleteImage(req.body.image.cloudinary_id);
  }
  post = await post
    .populate([
      { path: "community", select: "name" },
      { path: "author", select: "username avatar" },
    ])
    .execPopulate();
  res.status(201).json({ success: true, data: post });
});

// @ts-ignore
export const getPost = generalGetOne(Post, [
  { path: "comments" },
  { path: "community", select: "-members" },
  { path: "author" },
]);

// @ts-ignore
export const getAllPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @ts-ignore
export const getSavedPosts = asyncHandler(async (req, res, next) => {
  let student = await Student.findById(req.params.id).select('savedPosts');
  if (!student) {
    return next(new ErrorResponse(`No user found with that id`, 404));
  }
  student = await student
    .populate([
      {
        path: "savedPosts",
        populate: [
          { path: "community", select: "name" },
          {
            path: "author",
            select: "username avatar firebaseToken firstName lastName",
          },
        ],
      },
    ])
    .execPopulate();
    console.log(student)
  res.status(200).json({ success: true, data: student });
});
// @desc      Report Post
// @route     PUT /api/v1/posts/report/:id
// @access    Private
// @ts-ignore
export const reportPost = asyncHandler(async (req, res, next) => {
  let oldPost = await Post.findById(req.params.id);
  if (oldPost.reports.includes(req.user._id)) {
    return next(new ErrorResponse(`You have already reported this post`, 400));
  }
  let post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { reports: req.user._id } },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(post);
  if (!post) {
    return next(new ErrorResponse(`Error while reporting the post`, 400));
  }
  res.status(200).json({ success: true });
});

// @desc      Save Post
// @route     GET /api/v1/posts/save/:id
// @access    Private
// @ts-ignore
export const savePost = asyncHandler(async (req, res, next) => {
  let student = await Student.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { savedPosts: req.params.id } },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(student.savedPosts);
  if (!student) {
    return next(
      new ErrorResponse(`Error while saving the post, please try again`, 400)
    );
  }
  res.status(200).json({ success: true });
});

// @desc      Save Post
// @route     GET /api/v1/posts/save/:id
// @access    Private
// @ts-ignore
export const unsavePost = asyncHandler(async (req, res, next) => {
  let student = await Student.findByIdAndUpdate(
    req.user._id,
    { $pull: { savedPosts: req.params.id } },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(student.savedPosts);
  if (!student) {
    return next(
      new ErrorResponse(`Error while saving the post, please try again`, 400)
    );
  }
  res.status(200).json({ success: true });
});

// @ts-ignore
export const upvotePost = tempLike(Post);
// @ts-ignore
export const downvotePost = tempUnLike(Post);

// @route    DELETE api/v1/posts/:id
// @desc     delete a post
// @access   Private
// @ts-ignore
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse("No post found with that id", 404));
  }
  if (post.image.cloudinary_id) {
    await deleteImage(post.image.cloudinary_id);
  }

  //this check is going to explicitely handled on client side
  if (post.author._id.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("You cannot touch someone else's post", 400));
  }

  await post.remove();
  res.status(204).json({ succes: true });
});
// @ts-ignore
export const updatePost = asyncHandler(async (req, res, next) => {
  let oldPost = await Post.findById(req.params.id);
  // console.log({ f: req.file, b: req.body, o: oldPost })
  if (!req.file && oldPost.image) {
    req.body.image = undefined;
    await deleteImage(oldPost.image.cloudinary_id);
  }
  if (req.file) {
    req.body.image = await getUrl(req.file.path);
  }
  let post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new ErrorResponse(`Error while updating the post`, 404));
  }
  post = await post
    .populate([
      { path: "comments" },
      { path: "community", select: "-members" },
      { path: "author" },
    ])
    .execPopulate();
  res.status(200).json({ success: true, data: post });
});
