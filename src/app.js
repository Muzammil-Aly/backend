import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // use for data submitted from forms e.g coming from the body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // use for taking data from urls cz urls functionality is different
// extended is used cz it allows object within a object

app.use(express.static("public")); //used it for files like pdf , images etc

app.use(cookieParser()); // use it for brower curd opearaion like managing cookies

// routes import

import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweeter.routes.js";
import playlistRouter from "./routes/playList.routes.js";
// routes declaration

// app.use("/user", userRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/play-lists", playlistRouter);

export { app };
