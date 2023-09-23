import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGODB_URL;
import mongoose from "mongoose";
import booksRouter from "./routes/booksDetailsController";
import userRouter from"./routes/userRouter";

// Create express app
const app = express();

// Used to parse JSON from body
app.use(express.json());

// Basic Testing Routes
/////////////////////////////////////////////////////////////
// Route to test server
app.get("/", (req, res) => {
  console.log(req.headers);
  return res.status(234).send("Hello World");
});
/////////////////////////////////////////////////////////////
// Router to handle books
app.use("/books", booksRouter);

//////////////////////////////////////////////////////////
// Router to handle users
app.use("/users", userRouter);

/////////////////////////////////////////////////////////////
// Connect to MongoDB
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
 
