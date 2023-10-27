import mongoose from "mongoose";
import express from "express";
import { User } from "../models/userModel.js";
import { Book } from "../models/bookModel.js";

const ShoppingCartController = express.Router();

// 3.1 Retrieve the subtotal price of all items in the user’s shopping cart.
ShoppingCartController.get("/subtotal", async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find user
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get subtotal by adding price of each book
    let subtotal = 0;
    user.shoppingCart.forEach((item) => {
      subtotal += item.price;
    });

    return res.status(200).json({ message: `Your subtotal is: $${subtotal.toFixed(2)}` });
    } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// 3.2 Add a book to the shopping cart.
ShoppingCartController.post("/addToCart", async (req, res) => {
  try {
    const bookId = req.body.bookId;
    const userId = req.body.userId;

    // Find user by userID
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find book by bookID
    const book = await Book.findOne({ ISBN: bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found in shopping cart" });
    }

    // Add book to shopping cart
    await user.shoppingCart.push(book);
    await user.save();

    return res.status(200).json({ message: "Book added to shopping cart" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// 3.3 Retrieve the list of book(s) in the user’s shopping cart.
ShoppingCartController.get("/list", async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find user by userID
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let shoppingList = user.shoppingCart

    return res.status(200).json({ message: shoppingList });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

export default ShoppingCartController;
