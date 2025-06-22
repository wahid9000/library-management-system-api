import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";
import { Server } from "http";
const port = 5000;
let server: Server;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.wy87kp4.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB successfully !!!");
    server = app.listen(port, () => {
      console.log(`Connected to port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
