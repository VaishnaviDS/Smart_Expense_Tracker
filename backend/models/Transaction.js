import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  // 🔹 Common party field (merchant OR source)
  party: {
    type: String,
    required: true
  },

  category: String,
  description: String,

  receiptUrl: String,
  receiptHash: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Transaction", transactionSchema);