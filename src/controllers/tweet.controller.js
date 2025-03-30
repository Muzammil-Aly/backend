import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet

  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet field could not be empty");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const tweet = await Tweet.create({
    content,
    owner: user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet has been created Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const allTweets = await Tweet.find({ owner: user._id }).select("-owner -id");

  console.log("allTweets", allTweets);

  return res
    .status(200)
    .json(new ApiResponse(200, allTweets, "User tweets fetch successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const { content, tweetId } = req.body;

  const updateTweet = await Tweet.findOne({
    owner: user._id,
    _id: tweetId,
  });

  //   console.log("owner and tweetId", user, tweetId);

  if (!updateTweet) {
    throw new ApiError(404, "Tweet not found or access denied");
  }

  updateTweet.content = content;
  await updateTweet.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateTweet, "Tweet has been updated successfully")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const { tweetId } = req.body;
  console.log("tweetId", tweetId);

  if (!tweetId) {
    throw new ApiError(400, "Tweet Id is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet iD");
  }

  const deleteTweet = await Tweet.findOne({ _id: tweetId, owner: user._id });

  if (!deleteTweet) {
    throw new ApiError(400, "Tweet not found or access denied");
  }

  await Tweet.deleteOne({ _id: tweetId, owner: user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet has been deleted suceessfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
