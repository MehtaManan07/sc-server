import express from "express";
import {
  adminCheck,
  createCommunity,
  deleteCommunity,
  getCommunities,
  getOneCommunity,
  joinCommunity,
  leaveCommunity,
  updateCommunity,
} from "../controllers/community";
const router = express.Router();
import { Community } from "../models/Community";
import { advancedResults } from "../utils/filterFeatures";
import { authorize, protect } from "../middlewares/auth";
import multer from '../utils/multer'
router.use(protect);
router
  .route("/")
  // @ts-ignore
  .get(advancedResults(Community), getCommunities)
  .post(multer.single('file'),createCommunity);
router
  .route("/:id")
  .get(getOneCommunity)
  .delete(adminCheck, deleteCommunity)
  .put(multer.single('file') ,adminCheck, updateCommunity);
router.put('/join/:id',joinCommunity)
router.put('/leave/:id',leaveCommunity)
export default router;
