import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

// Route to create a book
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("ratings")
      .populate("author")
      .populate("comments");
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
router.get("/isbn/:isbn", async (req, res) => {
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
router.put("/isbn/:isbn", async (req, res) => {
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
router.delete("/isbn/:isbn", async (req, res) => {
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

export default router;
