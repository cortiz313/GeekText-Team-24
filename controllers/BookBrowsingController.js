// Feature #1 Book Browsing and Sorting
import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

class BookBrowsingController {
  // Bullet #1 - Get all books by genre
  async getBooksByGenre(req, res) {
    try {
      const books = await Book.find({ genre: req.params.genre }).populate(
        "ratings"
      );
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
      const books = await Book.find()
        .sort({ copiesSold: -1 })
        .limit(10)
        .populate("ratings");
      return res.status(200).json({
        count: books.length,
        data: books,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error 500 is " + error.message);
    }
  }

  async getBooksWithRating(req, res) {
    try {
      const minRating = parseFloat(req.params.rating);

      if (isNaN(minRating)) {
        return res.status(400).send("Invalid rating parameter");
      }

      const books = await Book.find()
        .populate("ratings")
        .populate("author")
        .populate("comments");
      const filteredBooks = books.filter((book) => {
        const totalRating = book.ratings.reduce(
          (acc, rating) => acc + rating.rating,
          0
        );
        const averageRating =
          book.ratings.length > 0 ? totalRating / book.ratings.length : 0;
        return averageRating >= minRating;
      });

      return res.status(200).json({
        count: filteredBooks.length,
        data: filteredBooks,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error 500 is " + error.message);
    }
  }

  async discountBooksByPublisher(req, res) {
    try {
      const publisher = req.body.publisher;
      const discount = parseFloat(req.body.discount);

      // Check if discount is a number and within the range of 0 to 1
      if (isNaN(discount) || discount < 0 || discount > 1) {
        return res
          .status(400)
          .send("Invalid discount parameter: must be between 0 and 1");
      }

      const books = await Book.find({ publisher: publisher });

      // Check if any books were found
      if (books.length === 0) {
        return res
          .status(404)
          .send(`No books found for publisher: ${publisher}`);
      }

      const updatedBooks = books.map((book) => {
        book.price = parseFloat((book.price * (1 - discount)).toFixed(2));
        book.save();
        return book;
      });

      return res.status(200).json({
        message: "Books updated successfully!",
        count: updatedBooks.length,
        data: updatedBooks,
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

router.get("/getBooksWithRating/:rating", (req, res) => {
  const controller = new BookBrowsingController();
  return controller.getBooksWithRating(req, res);
});

router.put("/discountByPublisher", (req, res) => {
  const controller = new BookBrowsingController();
  return controller.discountBooksByPublisher(req, res);
});

export default router;
