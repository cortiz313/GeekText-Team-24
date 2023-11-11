import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Rating } from "../models/ratingModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";

const BookRatingController = express.Router();

// Create a rating for a book given by a user.
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

    const createdRating = await newRating.save();
    book.ratings.push(createdRating._id);
    await book.save();
    return res
      .status(201)
      .send({ message: "Rating created successfully!", rating: createdRating });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Create a comment for a book given by a user.
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
    book.comments.push(createdComment._id);
    await book.save();

    return res.status(201).send({
      message: "Comment created successfully!",
      comment: createdComment,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Retrieve a list of comments for the book.
BookRatingController.get("/comment/:ISBN", async (req, res) => {
  try {
    const book = await Book.findOne({ ISBN: req.params.ISBN }).populate(
      "comments"
    );

    if (!book) {
      return res.status(404).json({ message: `Book not found!` });
    }

    const comments = book.comments;
    return res.status(200).json({
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Given a book Id, calculate the average rating as a decimal.
BookRatingController.get("/:ISBN", async (req, res) => {
  try {
    const book = await Book.findOne({ ISBN: req.params.ISBN }).populate(
      "ratings"
    );

    if (!book) {
      return res.status(404).json({ message: `Book not found!` });
    }

    if (!Rating || Rating.length === 0) {
      return 0; // Default to 0 if no ratings are found
    }

    const totalRating = book.ratings.reduce(
      (acc, rating) => acc + rating.rating,
      0
    );
    const averageRating = book.ratings.length > 0 ? totalRating / book.ratings.length : 0;

    return res.status(200).json({
      average: averageRating,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export default BookRatingController;
