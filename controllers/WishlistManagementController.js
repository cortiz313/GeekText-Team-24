import mongoose from "mongoose";
//Feature 6:
import express from "express";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

const WishlistController = express.Router();
//Feature 6.1: Create Wishlist for a user with unique name

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

//Create a wishlist under user
WishlistController.post('/:username/:wishlist', async (req, res) => {
  try {
    const username = req.params.username;
    const wishlistParams = req.params.wishlist;

    // Check if a user with the provided username already exists
    const userExists = await User.findOne({ username: username });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the wishlist name is unique for the user
    const wishlistExists = userExists.wishlist.some(wishlist => wishlist.name === wishlistParams);

    if (wishlistExists) {
      return res.status(400).json({ message: "Wishlist with this name already exists for the user" });
    }

    //Create a wishlist under user if user exists, and wishlist under unique name doesnt exist
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $push: { wishlist: { name: wishlistParams, items: [] } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Failed to create wishlist" });
    }

    return res.status(200).send({ message: "Created " + wishlistParams + " in " + username + "'s Wishlists" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});


//Feature 6.2 add books to wishlist
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

//Feature 6.3 Remove book from user wishlist and add to shopping cart.
WishlistController.delete('/:username/:wishlistName/addToShoppingCart', async (req, res) => {
  try{
    if (!req.body.bookId){
      return res.status(400).send("Missing bookID");
    }
    const userParam = req.params.username
    const wishNameParam = req.params.wishlistName
    const bookIdBody = req.body.bookId

    //Find User
    const userExists = await User.findOne({username: userParam});

    if(!userExists){
      return res.status(400).json({message: "User does not exist"})
    }

    //Find User Wishlist
    const wishlistExists = await userExists.wishlist.find(wish => wish.name === wishNameParam);
    
    if(!wishlistExists){
      return res.status(400).json({message: "User does not have a wishlist under that name."})
    }

    //Determine if book exists in database
    if (!mongoose.Types.ObjectId.isValid(bookIdBody)) {
      return res.status(400).json({ message: "Invalid book ID" });
    } 

    // Check if the bookId is not in the wishlist
    if (!wishlistExists.items.some(item => item.bookId.toString() === bookIdBody)) {
      return res.status(400).json({ message: "Book is not in the wishlist" });
    }

    // TODO: If bookId is in the wishlist, remove it and add to shopping cart
    const updatedWishlist = await User.findOneAndUpdate(
      { username: userParam, 'wishlist.name': wishNameParam },
      { $pull: { 'wishlist.$.items': { bookId: bookIdBody } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Failed to update User" });
    }

    //TODO: change method of searching book, instead of object ID, need to use book ISBN
    //TODO: change wishlist schema for items: Book: to use isbn instead of objectID

    await userExists.shoppingCart.push(bookIdBody);
    await userExists.save();
    return res.status(200).json({ message: "Book added to shopping cart" });

    
  }catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export default WishlistController;
