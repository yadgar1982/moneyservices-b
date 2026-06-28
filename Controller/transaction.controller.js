import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import transactionSchema from "../Model/transaction.model.js";

// Create Transaction
export const create = async (req, res) => {
  try {
    const { _id, ...data } = req.body;

    const documents = req.files?.documents
      ? `uploads/${req.files.documents[0].filename}`
      : null;

    const image = req.files?.image
      ? `uploads/${req.files.image[0].filename}`
      : null;

    const signature = req.files?.signature
      ? `uploads/${req.files.signature[0].filename}`
      : null;

    const transaction = await transactionSchema.create({
      ...data,
      image,
      signature,
      documents,
    });


    return res.status(201).json({
      msg: "Transaction created successfully",
      data: transaction,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

//get all transactions

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionSchema.find().sort({ _id: -1 });
    return res.status(200).json({ data: transactions });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

// Get transaction by Id
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: "ID is required" });

    // get ALL records with same transactionId
    const transactions = await transactionSchema.find({
      transactionId: id,
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    return res.status(200).json({ data: transactions });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

// get transaction by Account No
export const getTransactionByAccountNo = async (req, res) => {
  try {
    const { accountNo } = req.params;
    if (!accountNo)
      return res.status(400).json({ msg: "Account number is required" });

    const transaction = await transactionSchema.findOne({ accountNo });
    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    return res.status(200).json({ data: transaction });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

// update by Id
// export const updateOne = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;

//     const transaction = await transactionSchema.findByIdAndUpdate(id, data, {
//       new: true,
//     });
//     if (!transaction)
//       return res.status(404).json({ msg: "Transaction record not found" });

//     return res
//       .status(200)
//       .json({ msg: "Transaction record updated successfully", data: transaction });
//   } catch (err) {
//     return res.status(500).json({ msg: "Internal Server Error" + err.message });
//   }
// };

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ msg: "transactionId is required" });
    }

    // 🔒 Protect system fields
    delete data._id;
    delete data.transactionId;
    delete data.transactionType;

    // 🔥 Extract uploaded files
    const image = req.files?.image
      ? `uploads/${req.files.image[0].filename}`
      : undefined;

    const signature = req.files?.signature
      ? `uploads/${req.files.signature[0].filename}`
      : undefined;

    const documentFile = req.files?.document
      ? `uploads/${req.files.document[0].filename}`
      : undefined;

    const updateFields = {
      ...data,
      ...(image && { image }),
      ...(signature && { signature }),
      ...(documentFile && { documents: documentFile }),
    };
delete updateFields.fullname;

    const transactions = await transactionSchema.find({
      transactionId: id,
    });

    if (!transactions.length) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    // ===============================
    // 🔥 TRANSFER UPDATE
    // ===============================
    if (transactions.length === 2) {
      const originalAmount = Number(data.amount || 0);
      const convertedAmount = Number(data.finalAmount || 0);

     
      await transactionSchema.findOneAndUpdate(
        {
          transactionId: id,
          transactionType: "credit",
        },
        {
          ...updateFields,

          accountNo: data.to,
          fullname: data.receiverFullname,

          amount: convertedAmount,
          finalAmount: convertedAmount,
          currency: data.toCurrency,
        },
      );
     
      await transactionSchema.findOneAndUpdate(
        {
          transactionId: id,
          transactionType: "debit",
        },
        {
          ...updateFields,
          exchangeRate: data.exchangeRate,
          accountNo: data.accountNo,
          fullname: data.fullname,

          to: data.to,

          amount: originalAmount,
          finalAmount: convertedAmount,
          currency: data.fromCurrency,
        },
      );

      return res.status(200).json({
        msg: "Transfer updated correctly",
      });
    }

    // ===============================
    // 🔥 SINGLE UPDATE
    // ===============================
    const updated = await transactionSchema.findOneAndUpdate(
      { transactionId: id },
      { $set: updateFields },
      { new: true },
    );

    return res.status(200).json({
      msg: "Transaction updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
// update by account No
export const updateTransactionByAccountNo = async (req, res) => {
  try {
    const { accountNo } = req.params;
    const data = { ...req.body };

    if (!accountNo)
      return res.status(400).json({ msg: "Account number is required" });
    if (!data || Object.keys(data).length === 0)
      return res.status(400).json({ msg: "No data provided for update" });

    const transaction = await transactionSchema.findOneAndUpdate(
      { accountNo },
      data,
      { new: true },
    );
    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    return res.status(200).json({
      msg: "Transaction updated successfully",
      data: transaction,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Failed to update transaction", error: err.message });
  }
};

// Delete by ID
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// export const deleteTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) return res.status(400).json({ msg: "ID is required" });
// await transactionSchema.findOneAndDelete({ transactionId: id });

//     if (!transaction)
//       return res.status(404).json({ msg: "Transaction not found" });

//     // Match Multer upload folder
//     const uploadsFolder = path.join(__dirname, "../uploads");

//     const fileFields = ["documents", "image", "signature"];

//     for (const field of fileFields) {
//       const files = Array.isArray(transaction[field])
//         ? transaction[field]
//         : [transaction[field]];

//       for (const file of files) {
//         if (!file) continue;

//         // Remove leading "uploads/" if present
//         const fileName = file.replace(/^uploads[\\/]/, "");
//         const filePath = path.join(uploadsFolder, fileName);

//         try {
//           await fs.access(filePath); // check if file exists
//           await fs.unlink(filePath); //remore file
//         } catch (err) {
//           console.log(`${field} not found or could not delete: ${fileName}`);
//         }
//       }
//     }

//     await transactionSchema.findManyAndDelete({ transactionId: id });

//     return res
//       .status(200)
//       .json({ msg: "Transaction and associated files deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ msg: "Failed to delete transaction", error: err.message });
//   }
// };

// delete by account No

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: "ID is required" });

    const transactions = await transactionSchema.find({ transactionId: id });

    if (!transactions.length) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    const uploadsFolder = path.join(__dirname, "../uploads");
    const fileFields = ["documents", "image", "signature"];

    for (const transaction of transactions) {
      for (const field of fileFields) {
        const files = Array.isArray(transaction[field])
          ? transaction[field]
          : [transaction[field]];

        for (const file of files) {
          if (!file) continue;

          const fileName = file.replace(/^uploads[\\/]/, "");
          const filePath = path.join(uploadsFolder, fileName);

          await fs.unlink(filePath).catch(() => {});
        }
      }
    }

    await transactionSchema.deleteMany({ transactionId: id });

    return res.status(200).json({
      msg: "All transactions with this ID deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Failed to delete transactions",
      error: err.message,
    });
  }
};

export const deleteTransactionByAccountNo = async (req, res) => {
  try {
    const { accountNo } = req.params;
    if (!accountNo)
      return res.status(400).json({ msg: "Account number is required" });

    const transaction = await transactionSchema.findOneAndDelete({ accountNo });
    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    return res.status(200).json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Failed to delete transaction", error: err.message });
  }
};
