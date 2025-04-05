import { Router } from "express";

const router = Router();
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

router.route("/add-comment/:videoId").post(verifyJwt, addComment);
router.route("/get-video-comments/:videoId").get(verifyJwt, getVideoComments);
router
  .route("/update-comment/:videoId/:commentId")
  .patch(verifyJwt, updateComment);
router
  .route("/delete-comment/:videoId/:commentId")
  .delete(verifyJwt, deleteComment);

export default router;
