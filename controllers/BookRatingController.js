import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Rating } from "../models/ratingModel.js";

const BookRatingController = express.Router();

BookRatingController.post("/", async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).send("Missing field: username ");
    }
    if (!req.body.rating) {
      return res.status(400).send("Missing field: rating ");
    }
    if (!req.body.ISBN) {
      return res.status(400).send("Missing field: ISBN ");
    }

    const isbn = req.body.ISBN;
    const username = req.body.username;
    const rating = req.body.rating;

    const book = await Book.findOne({ ISBN: isbn });
    if (!book) {
      return res.status(404).json({ message: `Book not found!` });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: `User not found!` });
    }

    const newRating = new Rating({
      username: username,
      rating: rating,
      ISBN: isbn,
    });

    const createdRating = await Rating.create(newRating);
    return res
      .status(201)
      .send({ message: "Rating created successfully!", rating: createdRating });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export default BookRatingController;
