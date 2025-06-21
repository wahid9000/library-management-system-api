import mongoose from "mongoose";
import "dotenv/config";
import app from "./app";
const port = 5000;

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.wy87kp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  console.log('Connected to MongoDB successfully !!!');
  const server = app.listen(port, () => {
    console.log(`Connected to port ${port}`);
  });
}

main();
