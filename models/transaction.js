// Instances and Imports
const mongoose = require("mongoose");

// Schema
const TransactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    category: {
      type: String,
      enum: [
        "groceries",
        "utilities",
        "entertainment",
        "clothing",
        "gifts",
        "misc",
      ],
      default: "misc",
      required: true,
    },
    note: {
      type: String,
      maxLength: 200,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the mongoose model
module.exports = mongoose.model("Transaction", TransactionSchema);
