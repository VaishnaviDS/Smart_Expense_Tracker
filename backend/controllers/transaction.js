import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import fs from "fs";
import {
  extractExpenseFromReceipt,
  extractIncomeFromReceipt,
  extractExpensesFromText,
  extractIncomeFromText,
  generateFileHash,
  callGeminiWithRetry,
  detectReceiptType
} from "../utils/gemini.js";

//////////////////////////////////////////////////////////////
// ✅ CREATE MANUAL (INCOME OR EXPENSE)
//////////////////////////////////////////////////////////////

export const createManualTransaction = async (req, res) => {
  try {

    const {
      type,
      amount,
      date,
      party,
      category,
      description,
      receiptUrl,
      receiptHash
    } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      date,
      party,
      category,
      description,
      receiptUrl,
      receiptHash
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createTransactionFromTextAI = async (req, res) => {

  try {

    const { prompt } = req.body;

    const user = await User.findById(req.user.id);
    const userCategories = user.customCategories || [];

    //////////////////////////////////////////////////////
    // 🔥 DETECT TYPE USING AI
    //////////////////////////////////////////////////////

    const detectPayload = {
      contents: [
        {
          parts: [
            {
              text: `
Classify this as either:
"income" or "expense"

Text:
"${prompt}"

Return STRICT JSON:
{ "type": "" }
`
            }
          ]
        }
      ]
    };

    const detection = await callGeminiWithRetry(detectPayload);

    const detectedType = detection.type;

    //////////////////////////////////////////////////////
    // Extract based on detected type
    //////////////////////////////////////////////////////

    let extractedArray;

    if (detectedType === "expense") {
      extractedArray = await extractExpensesFromText(
        prompt,
        userCategories
      );
    } else {
      extractedArray = await extractIncomeFromText(
        prompt,
        userCategories
      );
    }

const extracted = extractedArray.map(item => ({
  type: detectedType,
  amount: item.total_amount || item.amount,
  date: item.date,
  party: item.merchant_name || item.source,
  category: item.category
}));

res.status(200).json({
  message: "Transactions extracted",
  transactions: extracted
});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};
export const getTransactions = async (req, res) => {
  try {

    const { type, year, month } = req.query;

    const filter = { user: req.user.id };

    if (type) {
      filter.type = type;
    }

    if (year) {
      const y = parseInt(year);

      if (month) {
        const m = parseInt(month) - 1;

        filter.date = {
          $gte: new Date(y, m, 1),
          $lte: new Date(y, m + 1, 0, 23, 59, 59)
        };
      } else {
        filter.date = {
          $gte: new Date(y, 0, 1),
          $lte: new Date(y, 11, 31, 23, 59, 59)
        };
      }
    }

    const transactions = await Transaction
      .find(filter)
      .sort({ date: -1 });

    res.json({
      count: transactions.length,
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const editTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    Object.assign(transaction, req.body);

    await transaction.save();

    res.json({
      message: "Transaction updated",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    if (
      transaction.receiptUrl &&
      fs.existsSync(transaction.receiptUrl)
    ) {
      fs.unlinkSync(transaction.receiptUrl);
    }

    await Transaction.findByIdAndDelete(id);

    res.json({
      message: "Transaction deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/transactionController.js

export const uploadTransactionReceiptAI = async (req, res) => {

  let filePath;

  try {

    filePath = req.file.path;

    const hash = generateFileHash(filePath);

    //////////////////////////////////////////////////////////
    // Duplicate check
    //////////////////////////////////////////////////////////

    const existing = await Transaction.findOne({
      receiptHash: hash,
      user: req.user.id
    });

    if (existing) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "This receipt was already processed."
      });
    }

    //////////////////////////////////////////////////////////
    // 🔥 AUTO DETECT TYPE USING AI
    //////////////////////////////////////////////////////////

    const mimeType = req.file.mimetype;

    // Try expense extraction

    const detectedType = await detectReceiptType(filePath, mimeType);

let aiData;

if (detectedType === "expense") {

  aiData = await extractExpenseFromReceipt(filePath, mimeType);

} else {

  aiData = await extractIncomeFromReceipt(filePath, mimeType);

}

    //////////////////////////////////////////////////////////
    // Normalize
    //////////////////////////////////////////////////////////

    const amount =
      aiData.total_amount || aiData.amount;

    const party =
      aiData.merchant_name || aiData.source;

    return res.status(200).json({
      message: "Receipt processed successfully",
      extracted: {
        type: detectedType,   // 🔥 AUTO DETECTED
        amount,
        party,
        category: aiData.category,
        date: aiData.date,
        receiptUrl: `uploads/${req.file.filename}`,
        receiptHash: hash
      }
    });

  } catch (error) {

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(500).json({
      message: error.message || "Receipt extraction failed"
    });
  }
};

//////////////////////////////////////////////////////////////
// ✅ CREATE BULK TRANSACTIONS
//////////////////////////////////////////////////////////////

export const createBulkTransactions = async (req, res) => {
  try {

    const { transactions } = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions provided"
      });
    }

    const formatted = transactions.map(txn => ({
      ...txn,
      user: req.user.id
    }));

    const saved = await Transaction.insertMany(formatted);

    res.status(201).json({
      message: "Transactions created successfully",
      transactions: saved
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};