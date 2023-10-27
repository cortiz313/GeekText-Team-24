import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Author } from "../models/authorModel.js";
import { Rating } from "../models/ratingModel.js";
import { Comment } from "../models/commentModel.js";
import { User } from "../models/userModel.js";

const BookDetailsController = express.Router();

// Feature 4.1: Create a book given that book's details
BookDetailsController.post("/createBook", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send("Missing field: title ");
    }
    if (!req.body.author) {
      return res.status(400).send("Missing field: author");
    }
    if (!req.body.genre) {
      return res.status(400).send("Missing field: genre ");
    }
    if (!req.body.copiesSold) {
      return res.status(400).send("Missing field: copiesSold ");
    }
    if (!req.body.ISBN) {
      return res.status(400).send("Missing field: ISBN");
    }
    if (!req.body.publisher) {
      return res.status(400).send("Missing field: publisher ");
    }
    if (!req.body.price) {
      return res.status(400).send("Missing field: price ");
    }
    if (!req.body.description) {
      return res.status(400).send("Missing field: description ");
    }
    if (!req.body.yearPublished) {
      return res.status(400).send("Missing field: yearPublished");
    }

    const firstName = req.body.author.firstName;
    const lastName = req.body.author.lastName;

    let author = await Author.findOne({ firstName, lastName });
    if (!author) {
      author = await Author.create({
        firstName: firstName,
        lastName: lastName,
      });
    }

    const existingAuthor = await Author.findOne({ firstName, lastName });
    let authorId = null;
    if (!existingAuthor) {
      // Option 1: Create the author if they do not exist
      const newAuthor = new Author(author);
      await newAuthor.save();
      authorId = newAuthor._id;
    } else {
      // Option 2: Use the existing author's ID
      authorId = existingAuthor._id;
    }

    // Create comments if they are provided
    let commentIds = [];
    if (req.body.comments && Array.isArray(req.body.comments)) {
      for (const comment of req.body.comments) {
        let user = await User.findOne({ username: comment.username });
        if (!user) {
          user = await User.create({
            username: comment.username,
            password: "defaultPassword",
            confirmPassword: "defaultPassword",
            email: `${comment.username}@example.com`,
          });
        }
        const newComment = new Comment({
          ...comment,
          user: user._id,
          ISBN: req.body.ISBN,
        });
        await newComment.save();
        commentIds.push(newComment._id);
      }
    }

    // Create ratings if they are provided
    let ratingIds = [];
    if (req.body.ratings && Array.isArray(req.body.ratings)) {
      for (const rating of req.body.ratings) {
        let user = await User.findOne({ username: rating.username });
        if (!user) {
          user = await User.create({
            username: rating.username,
            password: "defaultPassword",
            confirmPassword: "defaultPassword",
            email: `${rating.username}@example.com`,
          });
        }
        const newRating = new Rating({
          ...rating,
          user: user._id,
          ISBN: req.body.ISBN,
        });
        await newRating.save();
        ratingIds.push(newRating._id);
      }
    }

    const bookData = {
      title: req.body.title,
      author: authorId,
      genre: req.body.genre,
      copiesSold: req.body.copiesSold,
      ISBN: req.body.ISBN,
      publisher: req.body.publisher,
      price: req.body.price,
      description: req.body.description,
      yearPublished: req.body.yearPublished,
      ratings: ratingIds, // Include ratings
      comments: commentIds, // Include comments
    };

    const newBook = new Book(bookData);
    const book = await newBook.save();

    // Add the book to the author's booksWritten array
    author.booksWritten.push(book._id);
    await author.save();

    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error 500 is " + error.message);
  }
});

// Feature 4.2: Given a book's ISBN, return the book's details
BookDetailsController.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn);
    const book = await Book.find({ ISBN: isbn })
      .populate("ratings")
      .populate("author")
      .populate("comments");
    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Feature 4.3: Create an author given that Author's details
BookDetailsController.post("/createAuthor", async (req, res) => {
  try {
    if (!req.body.firstName) {
      return res.status(400).send("Missing field: firstName ");
    }
    if (!req.body.lastName) {
      return res.status(400).send("Missing field: lastName ");
    }
    if (!req.body.biography) {
      return res.status(400).send("Missing field: biography ");
    }
    if (!req.body.publisher) {
      return res.status(400).send("Missing field: publisher ");
    }

    const { firstName, lastName, biography, publisher } = req.body;

    // Check if the author already exists
    const existingAuthor = await Author.findOne({ firstName, lastName });
    if (existingAuthor) {
      return res.status(409).json({
        message: "Author already exists",
      });
    }

    // If the author does not exist, create a new one
    const newAuthorData = {
      firstName,
      lastName,
      biography,
      publisher,
    };

    const newAuthor = await Author.create(newAuthorData);
    return res.status(201).json(newAuthor);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

export default BookDetailsController;
