import mongoose from "mongoose";
import express from "express";
import { User } from "./models/userModel.js";
import { Book } from "../models/bookModel.js";

class ShoppingCartController {
    // 3.1 Retrieve the subtotal price of all items in the user’s shopping cart.
    async getSubtotalPrice(req, res) {
        try { 
            const user = await User.find({ userID: req.params.userID });
            const shoppingCart = user.shoppingCart;
            let total = 0;

            for (let book of shoppingCart) {
                total += book.price;
            }

            return res.status(200).json({
                shoppingCartTotal: total,
              });
        } catch (error) {
            console.log(error.message);
        res.status(500).send(`Internal Server Error ${error.message}`);
        }
    }
    // 3.2 Add a book to the shopping cart.
    async addBookToShoppingCart(req, res) {
        try {
            
        } catch (error) {

        }
    }
    // 3.3 Retrieve the list of books added to cart.
    async getBookList(req, res) {
      try {
        const user = await User.find({ userID: req.params.userID });
        return res.status(200).json({
          shoppingCart: user.shoppingCart,
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).send(`Internal Server Error ${error.message}`);
      }
    }
}

export default ShoppingCartController;
