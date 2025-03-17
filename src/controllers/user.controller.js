import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // getting userDetils {req.body can also be from form etc}

  const { fullName, email, username, password } = req.body;
  console.log("email : ", email);
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields  are required");
  }
  if (email.includes("@")) {
    console.log("Valid: Email contains @");
  } else {
    console.log("Invalid: Email does not contain @");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email is already exits");
  }

  // req.body is already given so MULLTER allows us have the access of req.files so we can handle images and other files

  const avatarLocalPath = req.files?.avatar[0]?.path; // this will give the local path of the file in which it is saved inits local path before uploading it into cloudinary

  const coverLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // uploading on cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  // creating user and entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowercase,
  });

  // making validation if usercreated or not and not passing important detals like password and refrshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
