import vault from "../Model/vault.model.js";

// Create vault
export const createVault = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const vaultDate = await vault.create(data);

    return res.status(201).json({
      msg: "data registered successfully",
      data: vaultDate,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

//get all vaults

export const getAllVaults = async (req, res) => {
  try {
    const vaults = await vault.find().sort({ transactionId: -1 });
    return res.status(200).json({ data: vaults });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

// Get transaction by Id
export const getVaultById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        msg: "TransactionId is required",
      });
    }

    const vaultRecord = await vault.findOne({
      transactionId: id,
    });

    if (!vaultRecord) {
      return res.status(404).json({
        msg: "Vault not found",
      });
    }

    return res.status(200).json({
      data: vaultRecord,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// get vault by Account No
export const getVaultByAcc = async (req, res) => {
  try {
    const { accountNo } = req.params;
    if (!accountNo)
      return res.status(400).json({ msg: "Account number is required" });

    const vaults = await vault.findOne({ accountNo });
    if (!vaults) return res.status(404).json({ msg: "Vaults not found" });

    return res.status(200).json({ data: vaults });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

//Update
// export const updateVault = async (req, res) => {
//   try {

//     const { id } = req.params;
//     const { transactionId, ...data } = req.body;

//     if (!id) {
//       return res.status(400).json({ msg: "transactionId is required" });
//     }

//     if (!Object.keys(data).length) {
//       return res.status(400).json({
//         msg: "No data provided",
//       });
//     }

//     const filter =
//   ["debit", "credit"].includes(data.transactionType)
//     ? {
//         transactionId: id,
//         transactionType: data.transactionType,
//       }
//     : { transactionId: id };

// const updated = await vault.findOneAndUpdate(
//   filter,
//   { $set: data },
//   { new: true },
// );
//     if (!updated) {
//       return res.status(404).json({
//         msg: "Vault not found",
//       });
//     }

//     return res.status(200).json({
//       msg: "Vault updated successfully",
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



export const updateVault = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, ...data } = req.body;

    const vaultTransactionId = transactionId || id;

    if (!vaultTransactionId) {
      return res.status(400).json({
        msg: "transactionId is required",
      });
    }

    if (!Object.keys(data).length) {
      return res.status(400).json({
        msg: "No data provided",
      });
    }

    const isDebitOrCredit = ["debit", "credit"].includes(
  data.transactionType
);

const filter = isDebitOrCredit
  ? {
      transactionId: vaultTransactionId,
      transactionType: data.transactionType,
      accountNo: String(data.accountNo || ""),
    }
  : {
      transactionId: vaultTransactionId,
      accountNo: String(data.accountNo || ""),
    };

const updated = await vault.findOneAndUpdate(
  filter,
  { $set: data },
  { new: true, runValidators: true }
);

if (updated) {
  return res.status(200).json({
    msg: "Vault updated successfully",
    data: updated,
  });
}


    // For transfers/exchanges, create the missing debit or credit record.
    if (isDebitOrCredit) {
      const created = await vault.create({
        ...data,
        transactionId: vaultTransactionId,
      });

      return res.status(200).json({
        msg: "Missing vault record created successfully",
        data: created,
      });
    }

    return res.status(404).json({
      msg: "Vault record not found",
      transactionId: vaultTransactionId,
    });
  } catch (err) {
    console.error("Vault update error:", err);

    return res.status(500).json({
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};



// Delete

export const deleteVault = async (req, res) => {
  try {
    const { id } = req.params;

    await vault.findOneAndDelete({ transactionId: id });

    return res.status(200).json({
      msg: "Vault deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
