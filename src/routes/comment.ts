import express from "express";
import {
  deleteComment,
  getComment,
  getCommentsForAPost,
  newComment,
} from "../controllers/comment";
const router = express.Router();
import { advancedResults } from "../utils/filterFeatures";
import { authorize, protect } from "../middlewares/auth";

router.use(protect);
router.post("/", newComment);
router.get("/:postID", getCommentsForAPost);

router.delete("/:id",deleteComment);
export default router;
