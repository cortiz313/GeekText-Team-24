import mongoose from "mongoose";
import express from "express";
import { User } from "./models/userModel.js";
import { Book } from "../models/bookModel.js";
import { Wishlist, wishlistSchema } from "../models/wishlistModel.js";
import error from "mongoose/lib/error/index.js";

const WishlistController = express.Router();
//Feature 6.1: Create Wishlist for a user with unique name

WishlistController.post('/createWishlist', async (req, res) => {
    
    newWishlist = {
        "name" : String,
        "username" : String
    }
    try{
        if(!req.body.name){
            return res.status(400).send("Missing field: name ");
        }
        if(!req.body.username){
            return res.status(400).send("User does not exist ");
        }

        const wishlist = await Wishlist.create(newWishlist);
        return res.status(201).send(wishlist);

    }catch (error){
        console.log(error.message);
        res.status(500).send(error.message);
    }
   

});

class BookBrowsingController {}


export default WishlistController;
