import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import express from "express";

// const app = express();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MOGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected !! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MOGODB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;

// app.on("error", (error) => {
//   console.log("Error in connecting database", error);
//   throw error;
// });
// app.listen(process.env.PORT, () => {
//   console.log(`App is listening on port ${process.env.PORT}`);
// });
