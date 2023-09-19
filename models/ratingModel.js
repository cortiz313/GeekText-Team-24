import mongoose from "mongoose";

const ratingSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  datestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);
export { Rating, ratingSchema };
