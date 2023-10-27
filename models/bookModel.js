import mongoose from "mongoose";
import { ratingSchema } from "./ratingModel.js";
import { commentSchema } from "./commentModel.js";
import { authorSchema } from "./authorModel.js";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    copiesSold: {
      type: Number,
      required: true,
    },
    ISBN: {
      type: Number,
      required: true,
      unique: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 50,
      maxLength: 1500,
      default: "No description available",
    },
    yearPublished: {
      type: Number,
      required: true,
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
export { Book, bookSchema };
