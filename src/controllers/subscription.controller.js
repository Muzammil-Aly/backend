import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not Found");
  }

  const subscription = await Subscription.findOne({
    subscriber: user._id,
    channel: channelId,
  });
  if (subscription) {
    await Subscription.deleteOne({
      subscriber: user._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed from the channel"));
  } else {
    await Subscription.create({
      subscriber: user._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscribed to the channel"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const channel = await Subscription.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not Found");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber"
  );
  if (!subscribers) {
    throw new ApiError(404, "No subscribers found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const subscriber = await Subscription.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(404, "Channel not Found");
  }
  const channels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel");
  if (!channels) {
    throw new ApiError(404, "No channels found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Subscribers fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
