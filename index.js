import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGODB_URL;
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
  console.log(req.headers);
  return res.status(234).send("Hello World");
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB connected");
    // Once we are connected to DB, run server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
