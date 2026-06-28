import {Schema,model}from "mongoose";
const currencySchema = new Schema({
  currency:{
    type:String,
    required:true,
    trim:true,
  },
  rate:{
    type:Number,
    trim:true,
  },
  country:{
    type:String,
    trim:true,
  },

},{timestamps:true});

export default model("currency",currencySchema)