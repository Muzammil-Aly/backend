import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Playlist name field could not be empty");
  }
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - User not authenticated");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: user._id,
  });
  if (!playlist) {
    throw new ApiError(500, "Something went wrong");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const playList = await Playlist.find({ owner: userId }).populate("videos");
  if (!playList) {
    throw new ApiError(404, "No playlist found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playList, "User playlists fetch successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) {
    throw new ApiError(404, "No playlist found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetch successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const addVideo = await Playlist.findById(playlistId);
  if (!addVideo) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Playlist.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const isVideoAlreadyInPlaylist = addVideo.videos.some(
    (video) => video.toString() === videoId
  );
  if (isVideoAlreadyInPlaylist) {
    throw new ApiError(400, "Video already in playlist");
  }
  addVideo.videos.push(videoId);
  await addVideo.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, addVideo, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const removeVideo = await Playlist.findById(playlistId);
  if (!removeVideo) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Playlist.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const isVideoAlreadyInPlaylist = removeVideo.videos.some(
    (video) => video.toString() === videoId
  );
  if (!isVideoAlreadyInPlaylist) {
    throw new ApiError(400, "Video not in playlist");
  }
  removeVideo.videos = removeVideo.videos.filter(
    (video) => video.toString() !== videoId
  );
  await removeVideo.save();
  return res
    .status(200)
    .json(new ApiResponse(200, removeVideo, "Video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const deletePlaylist = await Playlist.findById(playlistId);
  if (!deletePlaylist) {
    throw new ApiError(404, "Playlist not found");
  }
  await Playlist.deleteOne({ playlistId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const updatePlaylist = await Playlist.findById(playlistId);
  if (!updatePlaylist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (name && name.trim() !== "") {
    updatePlaylist.name = name;
  }
  if (description && description.trim() !== "") {
    updatePlaylist.description = description;
  }
  await updatePlaylist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "Playlist updated successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
