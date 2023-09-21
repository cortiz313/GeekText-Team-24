import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT;
const mongoDBURL = "mongodb+srv://justinr:dUj4ckiX26ARCyG4@geektext-team-24.zgqn2ve.mongodb.net/?retryWrites=true&w=majority";
import mongoose from "mongoose";
import booksRouter from "./routes/booksRouter.js";
import BookDetailsController from "./controllers/BookDetailsController.js";

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


// Router to handle books (temp. disabled)
// app.use("/books", booksRouter);
/////////////////////////////////////////////////////////////


// 
app.use("/books", BookDetailsController);


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
