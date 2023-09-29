import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT;
const mongoDBURL = "mongodb+srv://Chris0sorio11:asdfghjkl123@geektext-team-24.zgqn2ve.mongodb.net/?retryWrites=true&w=majority";
import mongoose from "mongoose";
import booksRouter from "./routes/booksRouter.js";
import BookDetailsController from "./controllers/BookDetailsController.js";
import BookBrowsingController from "./controllers/bookBrowsingController.js";
import ProfileManagementController from "./controllers/ProfileManagementController.js";
import WishlistManagementController from "./controllers/WishlistManagementController.js";

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
/////////////////////////////////////////////////////////////

// Implements Feature 4: Book Details
app.use("/bookDetails", BookDetailsController);
app.use("/user", ProfileManagementController);

// Router to get books by genre
app.use("/browsing", BookBrowsingController);
/////////////////////////////////////////////////////////////

app.use("/wishlist", WishlistManagementController);

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
