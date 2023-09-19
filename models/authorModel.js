import mongoose from "mongoose";

const authorSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    default: "No biography available",
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
});

const Author = mongoose.model("Author", authorSchema);
export { Author };
