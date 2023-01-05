import express from "express";
import {
  createPost,
  deletePost,
  downvotePost,
  getAllPosts,
  getPost as getOnePost,
  upvotePost,
  reportPost,
  updatePost,
  savePost,
  unsavePost,
  getSavedPosts
} from "../controllers/post";
const router = express.Router();
import { Post } from "../models/Post";
import { advancedResults } from "../utils/filterFeatures";
import { authorize, protect } from "../middlewares/auth";
import multer from '../utils/multer'

router.use(protect)
router
  .route("/")
  // @ts-ignore
  .get(advancedResults(Post), getAllPosts)
  .post(multer.single('file'),createPost);

router
  .route("/:id")
  .get(getOnePost)
  .delete(deletePost)
  .put(multer.single('file'),updatePost);
router.put('/upvote/:id',upvotePost)
router.put('/downvote/:id',downvotePost)
router.get('/report/:id',reportPost)
router.get('/save/:id',savePost)
router.get('/saved/:id',getSavedPosts)
router.get('/unsave/:id',unsavePost)
export default router;
