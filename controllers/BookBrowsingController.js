// Feature #1 Book Browsing and Sorting
import express from "express";
import { Book } from "../models/bookModel.js";
const router = express.Router();

class BookBrowsingController {
  // Bullet #1 - Get all books by genre
  async getBooksByGenre(req, res) {
    try {
      const books = await Book.find({ genre: req.params.genre });
      return res.status(200).json({
        count: books.length,
        data: books,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  }

  async getTopSellers(req, res) {
    try {
      const books = await Book.find().sort({ copiesSold: -1 }).limit(10);
      return res.status(200).json({
        count: books.length,
        data: books,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error 500 is " + error.message);
    }
  }
}

router.get("/genre/:genre", (req, res) => {
  const controller = new BookBrowsingController();
  return controller.getBooksByGenre(req, res);
});

router.get("/topSellers", (req, res) => {
  const controller = new BookBrowsingController();
  return controller.getTopSellers(req, res);
});

export default router;
