import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video id");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (!existingLike) {
    throw new ApiError(404, "Video not Found");
  }

  if (existingLike) {
    await Like.deleteOne({ likedBy: req.user._id });
    return res.status(200).json(new ApiResponse(200, {}, "UnLiked the video"));
  } else {
    await Like.create({ video: videoId, likedBy: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Liked to the channel"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (!existingLike) {
    throw new ApiError(404, "Comment not Found");
  }

  if (existingLike) {
    await Like.deleteOne({ likedBy: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "UnLiked the comment"));
  } else {
    await Like.create({ comment: commentId, likedBy: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Liked to the comment"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  //TODO: toggle like on tweet
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (!existingLike) {
    throw new ApiError(404, "Tweet not Found");
  }
  if (existingLike) {
    await Like.deleteOne({ likedBy: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "UnLiked the comment"));
  } else {
    await Like.create({ tweet: tweetId, likedBy: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Liked to the comment"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
