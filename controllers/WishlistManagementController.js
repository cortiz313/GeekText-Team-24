import mongoose from "mongoose";
import express from "express";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

//Feature 6:
const WishlistController = express.Router();
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

//Feature 6.1: Create Wishlist for a user with unique name
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
    if (!req.body.bookISBN) {
      return res.status(400).send("Missing bookISBN");
    }

    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;
    const bookISBN = req.body.bookISBN;

    // Find the user
    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's Wishlist
    const wishlistExists = userExists.wishlist.find(wish => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: "Wishlist not found for the user" });
    }

    // Check if the bookISBN is already in the wishlist
    if (wishlistExists.items.some(item => item.bookISBN.toString() === bookISBN.toString())) {
      return res.status(400).json({ message: "Book is already in the wishlist" });
    }

    // Add the book to the wishlist
    wishlistExists.items.push({ bookISBN: bookISBN });
    await userExists.save();

    return res.status(200).json({ message: "Book added to " + usernameParam + "'s wishlist successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//Feature 6.3 Remove book from user wishlist and add to shopping cart.
WishlistController.delete('/:username/:wishlistName/shoppingCart', async (req, res) => {
  try {
    if (!req.body.bookISBN) {
      return res.status(400).send('Missing bookISBN');
    }

    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;
    const bookISBN = req.body.bookISBN;

    // Find the user
    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user's Wishlist
    const wishlistExists = userExists.wishlist.find((wish) => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: 'Wishlist not found for the user' });
    }

    // Check if the bookISBN is not in the wishlist
    const bookInWishlist = wishlistExists.items.find((item) => item.bookISBN.toString() === bookISBN.toString());
    if (!bookInWishlist) {
      return res.status(400).json({ message: 'Book is not in the wishlist' });
    }

    // Remove the book from the wishlist
    wishlistExists.items = wishlistExists.items.filter((item) => item.bookISBN.toString() !== bookISBN.toString());
    await userExists.save();

    // Find the book by ISBN
    const book = await Book.findOne({ ISBN: bookISBN });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Add the book to the shopping cart
    userExists.shoppingCart.push(book);
    await userExists.save();

    return res.status(200).json({ message: 'Book removed from ' + usernameParam + "'s wishlist and added to Shopping cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//Feature 6.4 List all books from a user wishlist.
WishlistController.get('/:username/:wishlistName', async (req, res) => {
  try{
    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;

    // Find the user
    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user's Wishlist
    const wishlistExists = userExists.wishlist.find((wish) => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: 'Wishlist not found for the user' });
    }

    let wishlistBooks = wishlistExists.items
    return res.status(200).json({ message: wishlistBooks });


  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }

})

export default WishlistController;