import mongoose from "mongoose";
import { bookSchema } from "./bookModel.js";

const authorSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    default: "No biography available",
    required: false,
  },
  publisher: {
    type: String,
    required: false,
  },
  booksWritten: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const Author = mongoose.model("Author", authorSchema);
export { Author, authorSchema };
