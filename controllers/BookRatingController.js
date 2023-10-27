import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Rating } from "../models/ratingModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";

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

BookRatingController.post("/comment", async (req, res) => {
  try {
    if (!req.body.username) {
      return res.status(400).send("Missing field: username ");
    }
    if (!req.body.comment) {
      return res.status(400).send("Missing field: comment ");
    }
    if (!req.body.ISBN) {
      return res.status(400).send("Missing field: ISBN ");
    }

    const isbn = req.body.ISBN;
    const username = req.body.username;
    const comment = req.body.comment;

    const book = await Book.findOne({ ISBN: isbn });
    if (!book) {
      return res.status(404).json({ message: `Book not found!` });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: `User not found!` });
    }

    const newComment = new Comment({
      username: username,
      comment: comment,
      ISBN: isbn,
    });

    const createdComment = await Comment.create(newComment);

    return res
      .status(201)
      .send({ message: "Comment created successfully!", comment: createdComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

BookRatingController.get("/:ISBN/comment", async (req, res) => {
  try {
    const comment = await Book.find({ ISBN: req.params.isbn }).comments;
      return res.status(200).json({
        // count: comment.length,
        data: comment
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export default BookRatingController;
