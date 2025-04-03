import { Router } from "express";

const router = Router();
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/comment.controller.js";

router.route("/create-comment").post(verifyJwt, createComment);
router.route("/get-all-comments").get(verifyJwt, getAllComments);
router.route("/get-comment-id/:commentId").get(verifyJwt, getCommentById);
router.route("/update-comment/:commentId").patch(verifyJwt, updateComment);
router.route("/delete-comment/:commentId").delete(verifyJwt, deleteComment);

export default router;
