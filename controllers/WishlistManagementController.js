import mongoose from "mongoose";
//Feature 6:
import express from "express";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

const WishlistController = express.Router();
//Feature 6.1: Create Wishlist for a user with unique name

// TODO: update to get wishlist for a specific user and wishlist name
// right now, it's returning the wishlists collection
WishlistController.get("/", async (req, res) => {
  try {
    const wishlists = await Wishlist.find({});
    return res.status(200).json({
      count: wishlists.length,
      data: wishlists,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// push to a user's wishlist array
WishlistController.post('/:username', async (req, res) => {
  try {
    // TODO: find out how to check if username parameter is missing
    if (!req.body.name) {
      return res.status(400).send("Missing wishlist name");
    }
    
    const username = req.params.username;

    const userExists = await User.findOneAndUpdate(
      { username: username },
      { $push: { "wishlist": { name: req.body.name, items: [] } } },
    );

     if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
  

    return res.status(200).send({ message: "User's wishlist updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

WishlistController.post('/:username/:wishlistName/addbook', async (req, res) => {
  try {
    if (!req.body.bookId){
      return res.status(400).send("Missing bookID");
    }
    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;
    const bookId = req.body.bookId;

    // Find the user
    const userExist = await User.findOne({ username: usernameParam });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the user's Wishlist
    const wishlistExist = userExist.wishlist.find(wish => wish.name === wishlistParam);
    if (!wishlistExist) {
      return res.status(404).json({ message: "Wishlist not found for the user" });
    }

    // Check if bookID exists in DB
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Check if the bookId is already in the wishlist
    if (wishlistExist.items.some(item => item.bookId.toString() === bookId)) {
      return res.status(400).json({ message: "Book is already in the wishlist" });
    }

    // If bookId is not in the wishlist, add it
    const updatedUser = await User.findOneAndUpdate(
      { username: usernameParam, 'wishlist.name': wishlistParam },
      { $push: { 'wishlist.$.items': { bookId: bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to update User's Wishlist" });
    }

    return res.status(200).json({ message: "Book added to " +usernameParam + "'s wishlist successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});





export default WishlistController;
