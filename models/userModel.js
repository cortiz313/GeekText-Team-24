import mongoose from "mongoose";
import validator from "validator";
import { wishlistSchema } from "./wishlistModel.js";
import { addressSchema } from "./addressModel.js";
import { creditCardSchema } from "./creditCardModel.js";
import { bookSchema } from "./bookModel.js";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  confirmedPassword: {
    type: String,
    required: [true, "Please retype your password"],
    validate: {
      validator: function (retypedPassword) {
        return retypedPassword === this.password;
      },
      message: "Your passwords are not the same. Please retype password.",
    },
  },
  userID: {
    type: String,
    required: false,
    unique: true
  },
  name: {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address."],
  },
  homeAddress: addressSchema,
  wishlist: [wishlistSchema],
  creditCards: [creditCardSchema],
  shoppingCart: [bookSchema],
});

const User = mongoose.model("User", userSchema);
export { User, userSchema };
