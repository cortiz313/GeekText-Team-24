import mongoose from "mongoose";
//import { ratingSchema } from "./ratingModel.js";
//import { commentSchema } from "./commentModel.js";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
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
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    ISBN: {
      type: Number,
      required: true,
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

    //comments: [commentSchema],
    //ratings: [ratingSchema],
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
export { Book };
