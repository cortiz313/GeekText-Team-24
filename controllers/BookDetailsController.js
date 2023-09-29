import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Author } from "../models/authorModel.js";

const BookDetailsController = express.Router();

BookDetailsController.post("/createBook", async (req, res) => {
  try {
    const requiredFields = [
      "title",
      "author", // Assuming req.body.author is an object with firstname and lastname
      "genre",
      "copiesSold",
      "rating",
      "ISBN",
      "publisher",
      "price",
      "description",
      "yearPublished",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing fields: ${missingFields.join(", ")}`);
    }

    const firstName = req.body.author.firstName;
    const lastName = req.body.author.lastName;

    let author = await Author.findOne({ firstName, lastName });
    if (!author) {
      author = await Author.create({
        firstName: firstName,
        lastName: lastName,
        // Add any other relevant fields here
      });
    }

    const newBook = new Book({
      title: req.body.title,
      author: author,
      genre: req.body.genre,
      copiesSold: req.body.copiesSold,
      rating: req.body.rating,
      ISBN: req.body.ISBN,
      publisher: req.body.publisher,
      price: req.body.price,
      description: req.body.description,
      yearPublished: req.body.yearPublished,
    });

    const book = await Book.create(newBook);

    // Add the book to the author's booksWritten array
    author.booksWritten.push(book._id);
    await author.save();

    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error 500 is " + error.message);
  }
});

export default BookDetailsController;
