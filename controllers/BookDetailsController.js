import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Author } from "../models/authorModel.js";

const BookDetailsController = express.Router();

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
    if (!req.body.rating) {
      return res.status(400).send("Missing field: rating ");
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
import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";
import { Author } from "../models/authorModel.js";

const BookDetailsController = express.Router();

// Feature 4.1: Create a book given that book's details 
BookDetailsController.post("/createBook", async (req, res) => 
{
  try 
  {
    if (!req.body.title) 
    {
      return res.status(400).send("Missing field: title ");
    }
    if (!req.body.author) 
    {
      return res.status(400).send("Missing field: author");
    }
    if (!req.body.genre) 
    {
      return res.status(400).send("Missing field: genre ");
    }
    if (!req.body.copiesSold) 
    {
      return res.status(400).send("Missing field: copiesSold ");
    }
    if (!req.body.rating) 
    {
      return res.status(400).send("Missing field: rating ");
    }
    if (!req.body.ISBN) 
    {
      return res.status(400).send("Missing field: ISBN");
    }
    if (!req.body.publisher) 
    {
      return res.status(400).send("Missing field: publisher ");
    }
    if (!req.body.price) 
    {
      return res.status(400).send("Missing field: price ");
    }
    if (!req.body.description) 
    {
      return res.status(400).send("Missing field: description ");
    }
    if (!req.body.yearPublished) 
    {
      return res.status(400).send("Missing field: yearPublished");
    }

    const firstName = req.body.author.firstName;
    const lastName = req.body.author.lastName;

    let author = await Author.findOne({ firstName, lastName });
    if (!author) 
    {
      author = await Author.create({
        firstName: firstName,
        lastName: lastName,
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
  } 
  catch (error) 
  {
    console.log(error.message);
    res.status(500).send("Error 500 is " + error.message);
  }
});

// Feature 4.2: Given a book's ISBN, return the book's details
BookDetailsController.get("/isbn/:isbn", async (req, res) => 
{
    try 
    {
      const isbn = parseInt(req.params.isbn);
      const book = await Book.find({ ISBN: isbn });
      return res.status(200).json(book);
    } 
    catch (error) 
    {
      console.log(error.message);
      res.status(500).send(error.message);
    }
});

export default BookDetailsController;
