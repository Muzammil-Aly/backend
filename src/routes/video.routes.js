import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
} from "../controllers/video.controllerl";

const router = Router();

router.route("get-all-videos").get(verifyJwt, getAllVideos);
router.route("/publish-video").post(verifyJwt, publishAVideo);
router.route("/get-video-id").get(verifyJwt, getVideoById);
router.route("/get-update-video").get(verifyJwt, updateVideo);
router.route("/deleteVideo").delete(verifyJwt, deleteVideo);
router.route("/togglePublishStatus").get(verifyJwt, getVideoById);

export default router;
