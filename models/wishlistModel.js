import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  items: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export { Wishlist, wishlistSchema };
