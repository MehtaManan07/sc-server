import { Notification } from "../models/Notification";
import { Community } from "../models/Community";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../middlewares/ErrorResponse";
import { downVote, generalGetOne, upVote } from "../utils/factoryFunctions";
import { notifyMultipleUsers, notifySingleUser } from "../utils/firebase";

// very important check
// @ts-ignore
export const checkCommentOwner = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const post = await Post.findById(req.body.postID);
  if (req.user.id.toString() !== post.author.id.toString()) {
    if (comment.user.id.toString() !== req.user.id.toString())
      return next(
         new ErrorResponse(`You cannot touch someone else's comment.`, 403)
      );
  }
  next();
};

// @ts-ignore
export const newComment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  let comment = await Comment.create(req.body);
  comment = await comment
    .populate([
      { path: "user", select: "firstName lastName avatar username" },
      { path: "post", select: "author" },
    ])
    .execPopulate();
  console.log(comment);
  res.status(201).json({ success: true, data: comment });
  if (req.body.fbToken) {
    setTimeout(async () => {
      const navigate = {
        screen: "Post",
        options: {
          screen: 'SinglePostScreen',
          params: {id: comment.post._id, fbToken: req.body.firebaseToken, authorId: comment.post.author},
        },
      };
  notifySingleUser(
    req.body.fbToken,
    {
      type: "follow",
      navigate: JSON.stringify(navigate),
    },
    "People are commenting on your post",
    "Checkout now"
  );
    await Notification.create({
      message: `${req.user.username} commented on your post`,
      to: comment.post.author,
      from: req.user._id,
      navigate: JSON.stringify(navigate),
    });
    }, 1);
  }
});

// @ts-ignore
export const getCommentsForAPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);
  if (!post) {
    return next(new ErrorResponse("No post found with that id", 404));
  }
  res.status(200).json({ success: true, data: post.comments });
});

// @ts-ignore
export const getComment = generalGetOne(Comment);

// @ts-ignore
export const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`No comment found with id ${req.params.id}`, 404)
    );
  }
  await comment.remove();

  res.status(204).json({
    success: true,
    data: null,
  });
});

// very important check
// @ts-ignore
exports.checkCommentOwner = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const post = await Post.findById(req.body.postId);
  if (req.user._id.toString() !== post.user.id.toString()) {
    if (comment.user._id.toString() !== req.user._id.toString())
      return next(
        new ErrorResponse(`You cannot touch someone else's comment.`, 403)
      );
  }
  next();
};
