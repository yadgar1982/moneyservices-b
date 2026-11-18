
import comissionSchema from "../Model/comission.model.js";

// Create comission
// export const createComission = async (req, res) => {
//   try {
//     const { _id, ...data } = req.body;
//     const comission = await comissionSchema.create(data);

//     return res.status(201).json({
//       msg: "data registered successfully",
//       data: comission,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: err.message });
//   }
// };


export const createComission = async (req, res) => {
  try {
    const { _id, transactionId, ...data } = req.body;

    // Generate and claim the next ID using Commission records.
    // Retry if another request claims the same ID simultaneously.
    for (let attempt = 0; attempt < 10; attempt++) {
      const lastCommission = await comissionSchema
        .findOne({
          transactionId: { $regex: /^TRX-\d{8}$/ },
        })
        .sort({ transactionId: -1 })
        .select("transactionId")
        .lean();

      const lastNumber = lastCommission
        ? Number(lastCommission.transactionId.replace("TRX-", ""))
        : 0;

      const nextTransactionId = `TRX-${String(
        lastNumber + 1,
      ).padStart(8, "0")}`;

      try {
        const comission = await comissionSchema.create({
          ...data,
          transactionId: nextTransactionId,
        });

        return res.status(201).json({
          msg: "Commission registered successfully",
          transactionId: nextTransactionId,
          data: comission,
        });
      } catch (err) {
        // Another request may have claimed this ID.
        if (err.code === 11000 && attempt < 9) {
          continue;
        }

        throw err;
      }
    }

    return res.status(409).json({
      msg: "Could not generate a unique Transaction ID. Please try again.",
    });
  } catch (err) {
    console.error("CREATE COMMISSION ERROR:", err);

    return res.status(500).json({
      msg: err.message || "Failed to create Commission",
    });
  }
};

//get all comissions

export const getAllComissions = async (req, res) => {
  try {
    const comissions = await comissionSchema.find().sort({ transactionId: -1 });
    return res.status(200).json({ data: comissions });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

// Get transaction by Id
export const getComissionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        msg: "TransactionId is required",
      });
    }

    const comission = await comissionSchema.findOne({
      transactionId: id,
    });

    if (!comission) {
      return res.status(404).json({
        msg: "Commission not found",
      });
    }

    return res.status(200).json({
      data: comission,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// get comition by Account No
export const getComissionByAcc = async (req, res) => {
  try {
    const { accountNo } = req.params;
    if (!accountNo)
      return res.status(400).json({ msg: "Account number is required" });

    const comissions = await comissionSchema.findOne({ accountNo });
    if (!comissions)
      return res.status(404).json({ msg: "Comissoins not found" });

    return res.status(200).json({ data: comissions });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
  }
};

//Update
export const updateComission = async (req, res) => {
  try {
   
    const { id } = req.params;
    const { transactionId, ...data } = req.body;


    if (!id) {
      return res.status(400).json({ msg: "transactionId is required" });
    }

    if (!Object.keys(data).length) {
      return res.status(400).json({
        msg: "No data provided",
      });
    }

    const updated = await comissionSchema.findOneAndUpdate(
      { transactionId: id },
      { $set: data },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({
        msg: "Commission not found",
      });
    }

    return res.status(200).json({
      msg: "Comission updated successfully",
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



// Delete

export const deleteComission = async (req, res) => {
  try {
    const { id } = req.params;

    await comissionSchema.findOneAndDelete({ transactionId:id });

    return res.status(200).json({
      msg: "Commission deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
