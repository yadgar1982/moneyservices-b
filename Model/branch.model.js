import {Schema,model}from "mongoose";
const branchSchema = new Schema({
  branch:{
    type:String,
    required:true,
    trim:true,
  },
  branchCode:{
    type:String,
    required:true,
    trim:true,
  },
 

},{timestamps:true});

export default model("branch",branchSchema)