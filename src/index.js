// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in connecting database", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.Port}`);
    });
  })
  .catch((error) => {
    console.log("Mongo db connection failed", error);
  });

// import express from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error in connecting databse", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR", error);
//     throw error;
//   }
// })();
