import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    toFullname: { type: String },
    user:{ type:String},
    branch:{type:String},
    accountNo: { type: Number, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    exchangeRate: { type: Number,  },
    transactionId: { type: String, required: true },
    transactionNo: { type: String, required: true },
    transactionType: {
      type: String,
    },
    transaction:{
      type:String,
       enum: ["transfer", "transaction", "exchange"],
    },   
    transferNo: { type: String, default: null },
    
    to: {
      type: String,
    },
    details: { type: String, default: null },
    image: { type: String, default: null },
    signature: { type: String, default: null },
    documents: {type: String, default: null},
    isPass:{type:String, default:"false"},
  },

  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
