import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import comissionSchema from "../Model/comission.model";

// Create comission
export const createComission = async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    const comission = await comissionSchema.create(data);


  


    return res.status(201).json({
      msg: "data registered successfully",
      data: comission,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

//get all comissions

export const getAllComissions = async (req, res) => {
  try {
    const comissions = await comissionSchema.find().sort({ _id: -1 });
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

    if (!id) return res.status(400).json({ msg: "ID is required" });

    // get ALL records with same transactionId
    const comissions = await comissionSchema.find({
      transactionId: id,
    });

    if (!comissions || comissions.length === 0) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    return res.status(200).json({ data: comissions });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: err.message });
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
    const data = req.body;

    if (!id) {
      return res.status(400).json({ msg: "transactionId is required" });
    }



    const comissions = await comissionSchema.find({
      transactionId: id,
    });

    if (!comissions.length) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    const updated = await comissionSchema.findOneAndUpdate(
      { transactionId: id },
      { $set: updateFields },
      { new: true },
    );

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

export const deleteComission=(req,res)=>{
  try{
    const {transactionId}=req.params;
    const comission=await comissionSchema.findOneAndDelete({transactionId})
    if(!comission){
       return res.status(404).json({
        msg:"Comission not found"
      })
    }
    return res.status(200).json({
      msg:"Comission deleted successfully"
    })
    
  }catch(err){
    return res.status(500).json({
      msg:err.message
    })

  }
}

