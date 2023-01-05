import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../middlewares/ErrorResponse";
import { Post } from "../models/Post";
// @ts-ignore
export const getAll = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

export const generalGetOne = (Model: any, populate: any) =>
  // @ts-ignore
  asyncHandler(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new ErrorResponse("No doc found with that id", 404));
    }
    if (populate) {
      doc = await doc.populate(populate).execPopulate();
    }
    res.status(200).json({ success: true, data: doc });
  });

export const upVote = (Model: any) =>
  // @ts-ignore
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new ErrorResponse("No doc found with that id", 404));
    }
    if (doc.downvotes.includes(req.user._id)) {
      doc.downvotes = doc.downvotes.filter(
        (id: any) => id.toString() !== req.user._id.toString()
      );
    }
    if (doc.upvotes.includes(req.user._id)) {
      doc.upvotes = doc.upvotes.filter(
        (id: any) => id.toString() !== req.user._id.toString()
      );
    } else {
      doc.upvotes = doc.upvotes.push(req.user._id);
    }

    doc.voteCount = doc.upvotes.length - doc.downvotes.length;
    res.status(200).json({ success: true, data: doc });
    await doc.save({ validateBeforeSave: false });
  });
export const tempLike = (Model: any) =>
  // @ts-ignore
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { upvotes: req.user._id } },
      { new: true }
    );
    if (!doc) {
      return next(new ErrorResponse("No doc found with that id", 404));
    }
    res.json({ success: true, data: doc });
  });
  
export const tempUnLike = (Model: any) =>
  // @ts-ignore
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $pull: { upvotes: req.user._id } },
      { new: true }
    );
    if (!doc) {
      return next(new ErrorResponse("No doc found with that id", 404));
    }
    res.json({ success: true, data: doc });
  });

export const downVote = (Model: any) =>
  // @ts-ignore
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new ErrorResponse("No doc found with that id", 404));
    }
    if (doc.upvotes.includes(req.user._id)) {
      doc.upvotes = doc.upvotes.filter(
        (id: any) => id.toString() !== req.user._id.toString()
      );
    }
    if (doc.downvotes.includes(req.user._id)) {
      doc.downvotes = doc.downvotes.filter(
        (id: any) => id.toString() !== req.user._id.toString()
      );
    } else {
      doc.downvotes = doc.downvotes.push(req.user._id);
    }

    doc.voteCount = doc.upvotes.length - doc.downvotes.length;
    res.status(200).json({ success: true, data: doc });
    await doc.save({ validateBeforeSave: false });
  });
