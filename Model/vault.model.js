import mongoose from "mongoose";

const vualtSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    user:{ type:String},
    branch:{type:String},
    isActive:{type:Boolean,default:false},
    accountNo: { type: String, required: true },
    currency: { type: String, required: true },
    credit: { type: Number, required: true },
    credit: { type: Number, required: true },
    exchangeRate: { type: Number },
    transactionId: { type: String, required: true },
    transactionNo: { type: String},
    transactionType: {
      type: String,
    },
    transferNo: { type: String, default: null },
    details: { type: String, default: null },
    
  },

  { timestamps: true },
);

export default mongoose.model("Vualt", vualtSchema);
