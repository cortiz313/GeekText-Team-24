import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  zipCode: {
    type: Number,
    required: false,
    validate: {
      validator: function (zipCode) {
        return zipCode.length === 5;
      },
      message: "Zip code must be 5 numbers",
    },
  },
});

const Address = mongoose.model("Address", addressSchema);
export { Address, addressSchema };
