import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
} from "../controllers/video.controllerl.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addVideoToPlaylist } from "../controllers/playList.controller.js";

const router = Router();
router.route("/publish-video").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 }, // `videoFile` is the field name
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyJwt,
  publishAVideo
);
router.route("/get-all-videos").get(verifyJwt, getAllVideos);
router.route("/get-video-id/:videoId").get(verifyJwt, getVideoById);
router.route("/get-update-video/:videoId").get(verifyJwt, updateVideo);
router.route("/deleteVideo/:videoId").delete(verifyJwt, deleteVideo);
router.route("/togglePublishStatus/:videoId").get(verifyJwt, getVideoById);
router
  .route("/add-video-to-playlist/:playlistId/:videoId")
  .patch(verifyJwt, addVideoToPlaylist);
export default router;
