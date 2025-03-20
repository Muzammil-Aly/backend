import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access TOken");
  }
});
