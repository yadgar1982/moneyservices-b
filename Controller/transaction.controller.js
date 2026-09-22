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

// export const updateTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;

//     if (!id) {
//       return res.status(400).json({
//         msg: "transactionId is required",
//       });
//     }

//     // 🔒 Protect system fields
//     delete data._id;
//     delete data.transactionId;

//     // 🔥 Extract uploaded files
//     const image = req.files?.image
//       ? `uploads/${req.files.image[0].filename}`
//       : undefined;

//     const signature = req.files?.signature
//       ? `uploads/${req.files.signature[0].filename}`
//       : undefined;

//     const documentFile = req.files?.document
//       ? `uploads/${req.files.document[0].filename}`
//       : undefined;

//     // 🔥 Get existing transactions BEFORE building update
//     const transactions = await transactionSchema.find({
//       transactionId: id,
//     });

//     if (!transactions.length) {
//       return res.status(404).json({
//         msg: "Transaction not found",
//       });
//     }

//     // =====================================================
//     // 🔥 TRANSFER UPDATE
//     // =====================================================
//     //
//     // Keep your existing transfer behavior.
//     // The two records are identified by their CURRENT
//     // transactionType: credit and debit.
//     //
//     if (transactions.length === 2) {
//       const originalAmount = Number(data.amount || 0);
//       const convertedAmount = Number(data.finalAmount || 0);

//       // -----------------------------------------------
//       // CREDIT / RECEIVER
//       // -----------------------------------------------

//       const creditUpdateFields = {
//         ...data,

//         accountNo: data.to,
//         fullname: data.receiverFullname,

//         amount: convertedAmount,
//         finalAmount: convertedAmount,
//         currency: data.toCurrency,
//       };

//       delete creditUpdateFields._id;
//       delete creditUpdateFields.transactionId;
//       delete creditUpdateFields.transactionType;
//       delete creditUpdateFields.fullname;

//       if (image) creditUpdateFields.image = image;
//       if (signature) creditUpdateFields.signature = signature;
//       if (documentFile) {
//         creditUpdateFields.documents = documentFile;
//       }

//       await transactionSchema.findOneAndUpdate(
//         {
//           transactionId: id,
//           transactionType: "credit",
//         },
//         {
//           $set: creditUpdateFields,
//         },
//       );

//       // -----------------------------------------------
//       // DEBIT / SENDER
//       // -----------------------------------------------

//       const debitUpdateFields = {
//         ...data,

//         exchangeRate: data.exchangeRate,
//         accountNo: data.accountNo,
//         fullname: data.fullname,

//         to: data.to,

//         amount: originalAmount,
//         finalAmount: convertedAmount,
//         currency: data.fromCurrency,
//       };

//       delete debitUpdateFields._id;
//       delete debitUpdateFields.transactionId;
//       delete debitUpdateFields.transactionType;
//       delete debitUpdateFields.fullname;

//       if (image) debitUpdateFields.image = image;
//       if (signature) debitUpdateFields.signature = signature;
//       if (documentFile) {
//         debitUpdateFields.documents = documentFile;
//       }

//       await transactionSchema.findOneAndUpdate(
//         {
//           transactionId: id,
//           transactionType: "debit",
//         },
//         {
//           $set: debitUpdateFields,
//         },
//       );

//       return res.status(200).json({
//         msg: "Transfer updated correctly",
//       });
//     }

//     // =====================================================
//     // 🔥 SINGLE TRANSACTION UPDATE
//     // =====================================================

//     const currentTransaction = transactions[0];

//     const updateFields = {
//       ...data,
//       ...(image && { image }),
//       ...(signature && { signature }),
//       ...(documentFile && {
//         documents: documentFile,
//       }),
//     };

//     // Protect system fields
//     delete updateFields._id;
//     delete updateFields.transactionId;

//     // fullname is still protected exactly as before
//     delete updateFields.fullname;
//       const updated = await transactionSchema.findOneAndUpdate(
//       {
//         transactionId: id,
//       },
//       {
//         $set: updateFields,
//       },
//       {
//         new: true,
//       },
//     );

//     return res.status(200).json({
//       msg: "Transaction updated successfully",
//       data: updated,
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       msg: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };


export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({
        msg: "transactionId is required",
      });
    }

    // ==========================================
    // PROTECT SYSTEM FIELDS
    // ==========================================
    delete data._id;
    delete data.transactionId;

    // ==========================================
    // EXTRACT UPLOADED FILES
    // ==========================================
    const image = req.files?.image
      ? `uploads/${req.files.image[0].filename}`
      : undefined;

    const signature = req.files?.signature
      ? `uploads/${req.files.signature[0].filename}`
      : undefined;

    const documentFile = req.files?.document
      ? `uploads/${req.files.document[0].filename}`
      : undefined;

    // ==========================================
    // GET EXISTING TRANSACTIONS
    // ==========================================
    const transactions = await transactionSchema.find({
      transactionId: id,
    });

    if (!transactions.length) {
      return res.status(404).json({
        msg: "Transaction not found",
      });
    }

    // =====================================================
    // TRANSFER / EXCHANGE UPDATE
    // UPDATE ONLY THE RECORD BEING EDITED
    // =====================================================
    if (transactions.length === 2) {
      const transactionType = data.transactionType;

      // ==========================================
      // VALIDATE TRANSACTION TYPE
      // ==========================================
      if (
        transactionType !== "debit" &&
        transactionType !== "credit"
      ) {
        return res.status(400).json({
          msg: "Transaction type must be debit or credit",
        });
      }

      const originalAmount = Number(data.amount || 0);
      const finalAmount = Number(data.finalAmount || 0);

      // =================================================
      // CREDIT / RECEIVER
      // =================================================
      if (transactionType === "credit") {
        const creditUpdateFields = {
          ...data,

          accountNo: data.to,
          fullname: data.receiverFullname,

          amount: finalAmount,
          finalAmount: finalAmount,

          currency: data.toCurrency,
        };

        // Protect system fields
        delete creditUpdateFields._id;
        delete creditUpdateFields.transactionId;
        delete creditUpdateFields.transactionType;

        if (image) {
          creditUpdateFields.image = image;
        }

        if (signature) {
          creditUpdateFields.signature = signature;
        }

        if (documentFile) {
          creditUpdateFields.documents = documentFile;
        }

        const updated = await transactionSchema.findOneAndUpdate(
          {
            transactionId: id,
            transactionType: "credit",
          },
          {
            $set: creditUpdateFields,
          },
          {
            new: true,
          }
        );

        if (!updated) {
          return res.status(404).json({
            msg: "Credit transaction not found",
          });
        }

        return res.status(200).json({
          msg: "Credit transaction updated correctly",
          data: updated,
        });
      }

      // =================================================
      // DEBIT / SENDER
      // =================================================
      if (transactionType === "debit") {
        const debitUpdateFields = {
          ...data,

          exchangeRate: data.exchangeRate,

          accountNo: data.accountNo,
          fullname: data.fullname,

          to: data.to,

          // DEBIT ALWAYS USES ORIGINAL AMOUNT
          amount: originalAmount,
          finalAmount: originalAmount,

          currency: data.fromCurrency,
        };

        // Protect system fields
        delete debitUpdateFields._id;
        delete debitUpdateFields.transactionId;
        delete debitUpdateFields.transactionType;

        if (image) {
          debitUpdateFields.image = image;
        }

        if (signature) {
          debitUpdateFields.signature = signature;
        }

        if (documentFile) {
          debitUpdateFields.documents = documentFile;
        }

        const updated = await transactionSchema.findOneAndUpdate(
          {
            transactionId: id,
            transactionType: "debit",
          },
          {
            $set: debitUpdateFields,
          },
          {
            new: true,
          }
        );

        if (!updated) {
          return res.status(404).json({
            msg: "Debit transaction not found",
          });
        }

        return res.status(200).json({
          msg: "Debit transaction updated correctly",
          data: updated,
        });
      }
    }

    // =====================================================
    // SINGLE / NORMAL TRANSACTION UPDATE
    // DO NOT CHANGE THIS LOGIC
    // =====================================================

    const currentTransaction = transactions[0];

    const updateFields = {
      ...data,
      ...(image && { image }),
      ...(signature && { signature }),
      ...(documentFile && {
        documents: documentFile,
      }),
    };

    // Protect system fields
    delete updateFields._id;
    delete updateFields.transactionId;

    // fullname is still protected exactly as before
    delete updateFields.fullname;

    const updated = await transactionSchema.findOneAndUpdate(
      {
        transactionId: id,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
      }
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



// update Transactcion pass
export const updateTransactionPass=async(req,res)=>{
  try{
    const {id}=req.params;
    const {isPass}=req.body;

    const updated=await transactionSchema.updateMany(
      {transactionId:id},
      {$set:{isPass}},
      {new:true}
    );
    if(!updated){
      return res.status(404).json({
        success:false,
        message:"Transaction not found"
      });
    }
    return res.status(200).json({
      success:true,
      message:"Transaction updated successfully",
      data:updated
    });
  }catch(err){
    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:err.message,
    });
  }
}


// Delete by ID
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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



// Generate Trnsaction Id

export const getNextTransactionId=async(req,res)=>{
  try{
    // Find the latest transaction
    const lastTransactgion = await transactionSchema.findOne()
    .sort({transactionId:-1});
    let nextNumber=1;
    // If a transaction exists, get its number
    if(lastTransactgion && lastTransactgion.transactionId){
      nextNumber=
      parseInt(
        lastTransactgion.transactionId.replace("TRX-", ""),10 ) +1;}


    // Create the Next Id
    const transactionId = `TRX-${String(nextNumber).padStart(8, "0")}`;

    return res.status(200).json({
      transactionId,
    });
      
    }catch(error){
      console.error(error);
      return res.status(500).json({
        message:"Failed to generate Transaction Id"
      })
  }

}
