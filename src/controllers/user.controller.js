import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);

    const refreshToken = user.generateRefreshToken();
    const accesToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accesToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went Wrong while generating refresh and access token"
    );
  }
};

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

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email is already exits");
  }

  // req.body is already given so MULLTER allows us have the access of req.files so we can handle images and other files

  const avatarLocalPath = req.files?.avatar[0]?.path; // this will give the local path of the file in which it is saved inits local path before uploading it into cloudinary

  // const coverLocalPath = req.files?.coverImage[0]?.path;
  let coverLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverLocalPath = req.files.coverImage[0].path;
  }

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
    username: username.toLowerCase,
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

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send in cookies

  const { username, email, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }], // with $or MONGODB OPERATOR it can find any one of them
  });

  if (!user) {
    throw new ApiError(404, "User does not exit");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid user Credentials");
  }
  const { refreshToken, accesToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accesToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      200,
      {
        user: loggedInUser,
        accesToken,
        refreshToken,
      },

      "User logged In Successfully"
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", accesToken)
    .clearCookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
