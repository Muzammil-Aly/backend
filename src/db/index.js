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

    // try {
    //   await User.collection.dropIndex("emial_1");
    //   console.log("Dropped incorrect index: emial_1");
    // } catch (err) {
    //   if (err.code === 27) {
    //     console.log("Index emial_1 does not exist.");
    //   } else {
    //     console.log("Error dropping index:", err);
    //   }
    // }
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
