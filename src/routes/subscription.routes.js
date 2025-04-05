import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/toggleSubscription/:channelId")
  .post(verifyJwt, toggleSubscription);
router
  .route("/get-userChannel-subscription/:channelId")
  .get(verifyJwt, getUserChannelSubscribers);
router
  .route("/get-getSubscribe-channels/:subscriberId")
  .get(verifyJwt, getSubscribedChannels);

export default router;
