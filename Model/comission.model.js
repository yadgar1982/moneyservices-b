import mongoose from "mongoose";

const comissionSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    user:{ type:String},
    branch:{type:String},
    accountNo: { type: Number, required: true },
    currency: { type: String, required: true },
    credit: { type: Number, required: true },
    debit: { type: Number, required: true },
    transactionId: { type: String, required: true },
    transactionNo: { type: String, required: true },
    transactionType: {
      type: String,
    },
    transferNo: { type: String, default: null },
    details: { type: String, default: null },
    
  },

  { timestamps: true },
);

export default mongoose.model("Comission", comissionSchema);
