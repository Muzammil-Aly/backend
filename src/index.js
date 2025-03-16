// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

// const app = express();
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in connecting database", error);
      throw error;
    });

    app.get("/", (req, res) => {
      res.send("Server is running!");
    });
    console.log(app._router.stack.map((r) => r.route?.path));
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
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
