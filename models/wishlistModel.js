import mongoose from "mongoose";

const wishlistItemSchema = mongoose.Schema({
  bookISBN: {
    type: String,
    required: true,
  },
});

const wishlistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [wishlistItemSchema], // Use the updated schema for items
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export { Wishlist, wishlistSchema };
