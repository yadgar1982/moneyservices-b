
import mongoose from "mongoose";

const transactionCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Three-letter user prefix, e.g. MOH
      required: true,
    },
    sequence: {
      type: Number,
      default: 0,
      min: 0,
      max: 99999999,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "TransactionCounter",
  transactionCounterSchema
);
