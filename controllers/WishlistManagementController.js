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

    const result = await User.findOneAndUpdate(
      { username: username },
      { $push: { "wishlist": { name: req.body.name, items: [] } } },
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).send({ message: "User's wishlist updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export default WishlistController;
