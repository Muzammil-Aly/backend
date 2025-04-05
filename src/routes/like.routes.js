import { Router } from "express";

const router = Router();
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

router.route("/toggle-video-like/:videoId").post(verifyJwt, toggleVideoLike);
router
  .route("/toggle-comment-like/:commentId")
  .post(verifyJwt, toggleCommentLike);
router.route("/toggle-tweet-like/:tweetId").post(verifyJwt, toggleTweetLike);
router.route("/get-liked-videos/:userId").get(verifyJwt, getLikedVideos);

export default router;
