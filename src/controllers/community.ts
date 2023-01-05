import { Community } from "../models/Community";
import { Student } from "../models/Student";
import { Post } from "../models/Post";
import { asyncHandler } from "../middlewares/async";
import ErrorResponse from "../middlewares/ErrorResponse";
import { getUrl, deleteImage } from "../utils/cloudinary";
import { generalGetOne, getAll } from "../utils/factoryFunctions";

// @ts-ignore
export const adminCheck = asyncHandler(async (req, res, next) => {
  const community = await Community.findById(req.params.id);
  if (!community.admins.includes(req.user._id)) {
    return new ErrorResponse(`This is an admin only feature`, 400);
  }
  next();
});

// @route    POST api/v1/communities/
// @desc     Create a community
// @access   Private
// @ts-ignore
export const createCommunity = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  if (req.file) {
    req.body.coverImage = await getUrl(req.file.path);
  }
  req.body.createdBy = req.user._id;
  req.body.admins = [req.user._id];
  req.body.members = [req.user._id];
  const community = await Community.create(req.body);
  res.status(201).json({ success: true, data: community });
});

// @route    GET api/v1/communities/
// @desc     Get all communities
// @access   Public
// @ts-ignore
export const getCommunities = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @route    GET api/v1/communities/:id
// @desc     Get single community by id
// @access   Public
// @ts-ignore
export const getOneCommunity = generalGetOne(Community, [
  { path: "createdBy", select: "firstName lastName avatar username" },
]);

// @route    PUT api/v1/communities/:id
// @desc     Update single community by id
// @access   Private
// @ts-ignore
export const updateCommunity = asyncHandler(async (req, res, net) => {
  let community = await Community.findById(req.params.id);
  if (!community) {
    return new ErrorResponse(`No such community found`, 404);
  }
  if (req.file) {
    await deleteImage(community.coverImage.imageId);
    // @ts-ignore
    req.body.coverImage = await getUrl(req.file.path);
  }
  community = await Community.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: community });
});

// @route    DELETE api/v1/communities/:id
// @desc     Delete single community by id
// @access   Private
// @ts-ignore
export const deleteCommunity = asyncHandler(
  async (req: any, res: any, next: any) => {
    const doc = await Community.findById(req.params.id);
    if (!doc) {
      return next(new ErrorResponse("No document found with that ID", 404));
    }
    await deleteImage(doc.coverImage.imageId);
    await doc.remove();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// @route    POST api/v1/communities/join/:id
// @desc     Join a community by id
// @access   Private
// @ts-ignore
export const joinCommunity = asyncHandler(async (req, res, next) => {
  let community;
  community = await Community.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { members: req.user._id },
    },
    { new: true }
  );
  if (!community) {
    return next(new ErrorResponse("No such community exists", 404));
  }
  community = await community
    .populate([{ path: "createdBy", select: "firstName lastName username" }])
    .execPopulate();
  res.status(200).json({ success: true, data: community });
  await Student.findByIdAndUpdate(req.user._id, {
    $addToSet: { communities: req.params.id },
  });
});

// @route    POST api/v1/communities/leave/:id
// @desc     Leave a community by id
// @access   Private
// @ts-ignore
export const leaveCommunity = asyncHandler(async (req, res, next) => {
  const community = await Community.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { members: req.user._id },
    },
    { new: true }
  );
  if (!community) {
    return next(new ErrorResponse("No such community exists", 404));
  }
  res.status(200).json({ success: true, data: community });
  await Student.findByIdAndUpdate(req.user._id, {
    $pull: { communities: req.params.id },
  });
});
