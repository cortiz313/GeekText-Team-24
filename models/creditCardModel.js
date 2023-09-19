import mongoose from "mongoose";

const creditCardSchema = mongoose.Schema({
  creditCardNumber: {
    type: String,
    required: true,
  },
  securityCode: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
});

const CreditCard = mongoose.model("CreditCard", creditCardSchema);
export { CreditCard, creditCardSchema };
