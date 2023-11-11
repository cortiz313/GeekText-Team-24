import mongoose from "mongoose";
import express from "express";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

//Feature 6
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

//feature 6.1 Create wishlist under a user's wishlist array

WishlistController.post('/:username/:wishlist', async (req, res) => {
  try {
    const username = req.params.username;
    const wishlistParams = req.params.wishlist;

    const userExists = await User.findOne({ username: username });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlistExists = userExists.wishlist.some(wishlist => wishlist.name === wishlistParams);

    if (wishlistExists) {
      return res.status(400).json({ message: "Wishlist with this name already exists for the user" });
    }

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

//Feature 6.2: add books to user wishlist

WishlistController.post('/:username/:wishlistName/addbook', async (req, res) => {
  try {
    if (!req.body.bookISBN) {
      return res.status(400).send("Missing bookISBN");
    }

    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;
    const bookISBN = req.body.bookISBN;

    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlistExists = userExists.wishlist.find(wish => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: "Wishlist not found for the user" });
    }

    if (wishlistExists.items.some(item => item.bookISBN === bookISBN)) {
      return res.status(400).json({ message: "Book is already in the wishlist" });
    }

    const book = await Book.findOne({ ISBN: bookISBN });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    wishlistExists.items.push({ bookISBN: bookISBN, book: book._id });
    await userExists.save();

    return res.status(200).json({ message: "Book added to " + usernameParam + "'s wishlist successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//feature 6.3: remove book from wishlist and add to user shopping cart

WishlistController.delete('/:username/:wishlistName/shoppingCart', async (req, res) => {
  try {
    if (!req.body.bookISBN) {
      return res.status(400).send('Missing bookISBN');
    }

    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;
    const bookISBN = req.body.bookISBN;

    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlistExists = userExists.wishlist.find((wish) => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: 'Wishlist not found for the user' });
    }

    const bookInWishlist = wishlistExists.items.find((item) => item.bookISBN === bookISBN);
    if (!bookInWishlist) {
      return res.status(400).json({ message: 'Book is not in the wishlist' });
    }

    wishlistExists.items = wishlistExists.items.filter((item) => item.bookISBN !== bookISBN);
    await userExists.save();

    const book = await Book.findOne({ ISBN: bookISBN });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    userExists.shoppingCart.push(book);
    await userExists.save();

    return res.status(200).json({ message: 'Book removed from ' + usernameParam + "'s wishlist and added to Shopping cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//feature 6.4: list all books in a user wishlist

WishlistController.get('/:username/:wishlistName', async (req, res) => {
  try {
    const usernameParam = req.params.username;
    const wishlistParam = req.params.wishlistName;

    const userExists = await User.findOne({ username: usernameParam });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlistExists = userExists.wishlist.find((wish) => wish.name === wishlistParam);

    if (!wishlistExists) {
      return res.status(404).json({ message: 'Wishlist not found for the user' });
    }

    let wishlistBooks = wishlistExists.items;
    return res.status(200).json({ message: wishlistBooks });

  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

export default WishlistController;
