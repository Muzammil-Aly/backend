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

router.route("/create-playlist").post(verifyJwt, createPlaylist);
router.route("/getUser-playlists").post(verifyJwt, getUserPlaylists);
router.route("/ get-playlist-byId").post(verifyJwt, getPlaylistById);
router.route("/add-video-to-playlist").post(verifyJwt, addVideoToPlaylist);
router
  .route("/remove-video-from-playlist")
  .post(verifyJwt, removeVideoFromPlaylist);
router.route("/delete-playlist").post(verifyJwt, deletePlaylist);

router.route("/update-playlist").post(verifyJwt, updatePlaylist);

export default router;
