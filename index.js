import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGODB_URL;
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

// Used to parse JSON from body
app.use(express.json());

// Basic Testing Routes
/////////////////////////////////////////////////////////////
// Route to test server
app.get("/", (req, res) => {
  console.log(req.headers);
  return res.status(234).send("Hello World");
});

// Route to create a book
app.post("/books", async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.author ||
      !req.body.genre ||
      !req.body.copiesSold ||
      !req.body.rating ||
      !req.body.ISBN ||
      !req.body.publisher ||
      !req.body.price ||
      !req.body.description ||
      !req.body.yearPublished
    ) {
      return res.status(400).send("Missing required fields");
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      copiesSold: req.body.copiesSold,
      rating: req.body.rating,
      ISBN: req.body.ISBN,
      publisher: req.body.publisher,
      price: req.body.price,
      description: req.body.description,
      yearPublished: req.body.yearPublished,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// Route to get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// Route to get one book BY ISBN
app.get("/books/isbn/:isbn", async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn);
    const book = await Book.find({ ISBN: isbn });
    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// Route to update a book by ISBN
app.put("/books/isbn/:isbn", async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.author ||
      !req.body.genre ||
      !req.body.copiesSold ||
      !req.body.rating ||
      !req.body.ISBN ||
      !req.body.publisher ||
      !req.body.price ||
      !req.body.description ||
      !req.body.yearPublished
    ) {
      return res.status(400).send("Missing required fields");
    }
    const isbn = parseInt(req.params.isbn);
    const result = await Book.findOneAndUpdate({ ISBN: isbn }, req.body);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});

// Route to delete a book by ISBN
app.delete("/books/isbn/:isbn", async (req, res) => {
  try {
    const isbn = parseInt(req.params.isbn);

    const result = await Book.findOneAndDelete({ ISBN: isbn });

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`Internal Server Error ${error.message}`);
  }
});
/////////////////////////////////////////////////////////////

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB connected");
    // Once we are connected to DB, run server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
