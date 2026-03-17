import express from "express";
import {authenticate} from "../middlewares/auth.js";
import { createBulkTransactions, createManualTransaction, createTransactionFromTextAI, deleteTransaction, editTransaction, getTransactions, uploadTransactionReceiptAI } from "../controllers/transaction.js";
import { upload } from "../utils/upload.js";


const router = express.Router();

router.post("/manual",authenticate,createManualTransaction)
router.post("/ai-text",authenticate,createTransactionFromTextAI)
router.post("/receipt",authenticate,upload.single("receipt"),uploadTransactionReceiptAI
)
router.put("/:id", authenticate, editTransaction);      // edit
router.delete("/:id", authenticate, deleteTransaction); // delete

router.get("/", authenticate, getTransactions);
router.post("/bulk", authenticate, createBulkTransactions);

export default router;