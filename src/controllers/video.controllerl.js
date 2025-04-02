import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Ffmpeg from "fluent-ffmpeg";
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoLocalPath = req.files?.videoFile[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
      Ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration); // Extracts video duration
      });
    });
  };
  const duration = await getVideoDuration(videoLocalPath);

  const uploadVideo = await uploadOnCloudinary(videoLocalPath);
  if (!uploadVideo) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadThumbnail) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  const user = await User.findById(req.user._id);
  console.log("user", user);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const videoDefaults = await Video.findOne()
    .select("duration views isPublished")
    .lean();

  const video = await Video.create({
    videoFile: uploadVideo.url,
    thumbnail: uploadThumbnail.url,
    // duration: req.body.duration || videoDefaults?.duration || 0,
    duration: duration || videoDefaults?.duration || 0,
    views: req.body.views || videoDefaults?.views || 0,
    isPublished: true,

    owner: user._id,
    title,
    description,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video has been published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!thumbnailLocalPath && !title && !description) {
    throw new ApiError(400, "Video file or title or description is required");
  }

  const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: uploadThumbnail ? uploadThumbnail.url : undefined,
    },
    { new: true }
  );

  if (!updateVideo) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await Video.deleteOne({ _id: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video publish status updated successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
