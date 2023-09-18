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

app.get("/", (req, res) => {
  console.log(req.headers);
  return res.status(234).send("Hello World");
});

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
