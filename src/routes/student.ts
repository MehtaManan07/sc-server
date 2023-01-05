import express from "express";
import { logout, signup } from "../controllers/studentAuth";
import {
  getMe,
  getAllStudents,
  followUser,
  unfollowUser,
  updateProfile,
  savePost,
  getMyNotifications,
  getStudent,
} from "../controllers/student";

const router = express.Router();
import { Student } from "../models/Student";
import { advancedResults } from "../utils/filterFeatures";
import { protect } from "../middlewares/auth";
import multer from "../utils/multer";

router.post("/signup", multer.single("file"), signup);
router.get("/logout", logout);
router.use(protect);
// @ts-ignore
router.get("/", advancedResults(Student), getAllStudents);
router.get("/notifications", getMyNotifications);
router.get("/me", getMe);
router.get("/:id", getStudent);
router.put("/:id", multer.single("file"), updateProfile);
router.put("/follow/:followId", followUser);
router.put("/unfollow/:unfollowId", unfollowUser);
router.put("/save/:postId", savePost);
// router.get("/notifications/:id", getMyNotifications);

export default router;
