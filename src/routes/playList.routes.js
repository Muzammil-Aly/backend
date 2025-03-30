import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playList.controller.js";

const router = Router();
// ("/c/:username");
// router.route("/delete-Tweet").delete(verifyJwt, deleteTweet);

router.route("/create-playlist").post(verifyJwt, createPlaylist);
router.route("/getUser-playlists/:userId").get(verifyJwt, getUserPlaylists);
router.route("/get-playlist-byId/:playlistId").get(verifyJwt, getPlaylistById);
router.route("/add-video-to-playlist").post(verifyJwt, addVideoToPlaylist);
router
  .route("/remove-video-from-playlist")
  .post(verifyJwt, removeVideoFromPlaylist);
router.route("/delete-playlist/:playlistId").delete(verifyJwt, deletePlaylist);

router.route("/update-playlist/:playlistId").put(verifyJwt, updatePlaylist);

export default router;
