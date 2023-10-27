import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDB_URL;
import mongoose from "mongoose";
import booksRouter from "./routes/booksRouter.js";
import BookDetailsController from "./controllers/BookDetailsController.js";
import BookRatingController from "./controllers/BookRatingController.js";
import BookBrowsingController from "./controllers/BookBrowsingController.js";
import ProfileManagementController from "./controllers/ProfileManagementController.js";
import WishlistManagementController from "./controllers/WishlistManagementController.js";
import ShoppingCartController from "./controllers/ShoppingCartController.js";

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

// Router to add rating
app.use("/rating", BookRatingController);

// Router to get books by genre
app.use("/browsing", BookBrowsingController);
/////////////////////////////////////////////////////////////

app.use("/wishlist", WishlistManagementController);

// Router to handle shopping cart
app.use("/shoppingCart", ShoppingCartController);

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
