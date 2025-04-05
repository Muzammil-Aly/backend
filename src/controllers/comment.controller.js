import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const videoExits = await Video.findById(videoId);
  if (!videoExits) {
    throw new ApiError(404, "Video does not exist");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.create({
    content,
    owner: user._id,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment has been added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { videoId, commentId } = req.params;
  const { content } = req.body;
  //   const { commentId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const videoExits = await Video.findById(videoId);
  if (!videoExits) {
    throw new ApiError(404, "Video does not exist");
  }

  const commenttExists = await Comment.findById(commentId);
  if (!commenttExists) {
    throw new ApiError(404, "Comment does not exist");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  if (commenttExists.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  commenttExists.content = content;
  await commenttExists.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        commenttExists,
        "Comment has been updated successfully"
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { videoId } = req.params;
  const { commentId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const videoExits = await Video.findById(videoId);
  if (!videoExits) {
    throw new ApiError(404, "Video does not exist");
  }

  const commenttExists = await Comment.findById(commentId);
  if (!commenttExists) {
    throw new ApiError(404, "Comment does not exist");
  }

  const deleteComment = await Comment.deleteOne({ _id: commenttExists._id });
  if (deleteComment.deletedCount === 0) {
    throw new ApiError(400, "Comment not found or access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment has been deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
