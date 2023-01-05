import { Notification } from "../models/Notification";
import { Student } from "../models/Student";
import ErrorResponse from "../middlewares/ErrorResponse";
import { asyncHandler } from "../middlewares/async";
import { getUrl, deleteImage } from "../utils/cloudinary";
import { notifyMultipleUsers, notifySingleUser } from "../utils/firebase";
// @desc      GET all students
// @route     GET /api/v1/students?params
// @access    Public
// @ts-ignore
export const getAllStudents = asyncHandler(async (req, res, next) => {
	
	res.status(200).json(res.advancedResults);
});

// @desc      GET me
// @route     GET /api/v1/students/me
// @access    Private
// @ts-ignore
export const getMe = asyncHandler(async (req, res, next) => {
	let student = await Student.findById(req.user._id);
	if (!student) {
		return next(new ErrorResponse(`No user found with that id`, 404));
	}
	student = await student
		.populate([
			{ path: "followers", select: "username firstName lastName avatar" },
			{ path: "following", select: "username firstName lastName avatar" },
			{ path: "notifications", select: "message navigate createdAt read" },
		])
		.execPopulate();
	res.status(200).json({ success: true, data: student });
});

// @desc      GET particular student by id
// @route     GET /api/v1/students/:id
// @access    Private
// @ts-ignore
export const getStudent = asyncHandler(async (req, res, next) => {
	const student = await Student.findById(req.params.id);
	if (!student) {
		return next(new ErrorResponse(`No user found with that id`, 404));
	}
	res.status(200).json({ success: true, data: student });
});

// @ts-ignore
export const getMyNotifications = asyncHandler(async (req, res, next) => {
	const notifications = await Notification.find({ to: req.user._id });
	if (!notifications) {
		return next(new ErrorResponse(`No notifications found for that user`, 404));
	}
	res.status(200).json({ success: true, data: notifications });
});

// @route    POST api/v1/users/follow/:followId
// @desc     forgot password
// @access   Public
// @ts-ignore
export const followUser = asyncHandler(async (req, res, next) => {
	const followee = await Student.findById(req.params.followId);

	// check if the user exists
	if (!followee) {
		return next(new ErrorResponse("User not found", 404));
	}

	// update the logged in user
	await Student.findByIdAndUpdate(req.user._id, {
		$addToSet: { following: followee._id },
	});

	//update the user being followed
	const followeeUpdated = await Student.findByIdAndUpdate(
		followee._id,
		{
			$addToSet: { followers: req.user._id },
		},
		{ new: true }
	);
	res.json({
		success: true,
		data: followeeUpdated, // will send the data
	});
	setTimeout(async () => {
		const navigate = {
			screen: "Profile",
			options: {
				screen: "PeerProfileScreen",
				params: { id: followee._id, username: followee.username },
			},
		};
		notifySingleUser(
			followee.firebaseToken,
			{
				type: "follow",
				navigate: JSON.stringify(navigate),
			},
			`Hi ${followee.firstName}`,
			`${req.user.firstName} ${req.user.lastName} started following you`
		);
		await Notification.create({
			message: `${req.user.username} started following you`,
			to: followee._id,
			from: req.user._id,
			navigate: JSON.stringify(navigate),
		});
	}, 1);
});

// @route    POST api/v1/users/unfollow/:unfollowId
// @desc     forgot password
// @access   Public
// @ts-ignore
export const unfollowUser = asyncHandler(async (req, res, next) => {
	const unFollowee = await Student.findById(req.params.unfollowId);

	// check if the user exists
	if (!unFollowee) {
		return next(new ErrorResponse("User not found", 404));
	}

	//check if the logged in user is already a follower
	//this check is going to explicitely handled on client side
	// if (!unFollowUser.followers.includes(req.user._id)) {
	//   return next(
	//     new ErrorResponse("You cannot unfollow the user you don't follow", 404)
	//   );
	// }

	// update the logged in user
	await Student.findByIdAndUpdate(req.user._id, {
		$pull: { following: unFollowee._id },
	});

	//update the user being followed
	const unfollowedUser = await Student.findByIdAndUpdate(
		unFollowee._id,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true }
	);

	res.json({
		success: true,
		data: unfollowedUser, // will send the data of the unfollowed user
	});
});

// @desc      Update Profile
// @route     PUT /api/v1/students/:id
// @access    Private
// @ts-ignore
export const updateProfile = asyncHandler(async (req, res, next) => {
	if (req.params.id.toString() !== req.user._id.toString()) {
		return next(
			new ErrorResponse(`You cannot touch anyone else's profile`, 400)
		);
	}
	if (req.file) {
		req.body.avatar = await getUrl(req.file.path);
		await deleteImage(req.body.cloudinary_id);
	}
	const student = await Student.findByIdAndUpdate(req.user._id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!student) {
		return next(
			new ErrorResponse(`No document found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: student });
});

// @desc      Save Post
// @route     PUT /api/v1/users/save/:postId
// @access    Private
// @ts-ignore
export const savePost = asyncHandler(async (req, res, next) => {
	let student = await Student.findByIdAndUpdate(
		req.user._id,
		{ $addToSet: { savedPosts: req.params.postId } },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!student) {
		return next(new ErrorResponse(`Error while saving the post`, 400));
	}
	res.status(200).json({ success: true, data: student.savedPosts });
});

// @desc      Deactivate account
// @route     PUT /api/v1/students/deactivate/:id
// @access    Private
// @ts-ignore
export const deactivateStudent = asyncHandler(async (req, res, next) => {
	if (req.params.id.toString() !== req.user._id.toString()) {
		return next(
			new ErrorResponse(`You cannot touch anyone else's profile`, 400)
		);
	}
	const student = await Student.findByIdAndUpdate(
		req.params.id,
		{ active: false },
		{
			new: true,
			runValidators: true,
		}
	);

	if (!student) {
		return next(
			new ErrorResponse(`No document found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: student });
});
