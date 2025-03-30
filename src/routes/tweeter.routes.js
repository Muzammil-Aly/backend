import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJwt, createTweet);
router.route("/get-user-tweets").get(verifyJwt, getUserTweets);
router.route("/update-Tweet").patch(verifyJwt, updateTweet);
router.route("/delete-Tweet").delete(verifyJwt, deleteTweet);
// router.route("/c/:username").get(verifyJwt, getUserChannelProfile);

export default router;
