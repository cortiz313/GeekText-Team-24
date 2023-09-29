import mongoose from "mongoose";
//Feature 6:
import express from "express";
//import { User } from "./models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

const WishlistController = express.Router();
//Feature 6.1: Create Wishlist for a user with unique name

WishlistController.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send("Missing wishlist name");
        }
        if (!req.body.username) {
            return res.status(400).send("Missing wishlist username");
        }

        const wishlistFromParams = {
            name: req.body.name,
            username: req.body.username,
            items: []
        };

        const createdWishlist = await Wishlist.create(wishlistFromParams);
        return res.status(201).send(createdWishlist);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

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

export default WishlistController;
