import express from "express";
const transactionRouter = express.Router();
import { upload } from "../../Middleware/uploadMiddleware.js";
import {
  create,
  getAllTransactions,
  updateTransaction,
  getTransactionByAccountNo,
  getTransactionById,
  deleteTransaction,
  updateTransactionByAccountNo, 
 
} from "../../Controller/transaction.controller.js";

// Create a transaction
transactionRouter.post(
  "/create",
 upload.fields([
    { name: "image", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "documents", maxCount: 1 },
  ]),
  create
);

// Get all transactions
transactionRouter.get('/read', getAllTransactions);

// Get all transactions
transactionRouter.get('/readbyid/:id', getTransactionById);

// Update a transaction by ID
transactionRouter.put(
  '/update/:id',
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "documents", maxCount: 1 }, 
  ]),
  updateTransaction
);

// Delete a transaction by ID
transactionRouter.put("/update/:id", updateTransaction);
// Delete a transaction by ID
transactionRouter.delete('/delete/:id', deleteTransaction);

// Update transaction by Account Number
transactionRouter.put('/updatebyaccountno/:accountNo', updateTransactionByAccountNo);

// Get transaction by Account Number
transactionRouter.get('/getbyaccountno/:accountNo', getTransactionByAccountNo);

export default transactionRouter;
