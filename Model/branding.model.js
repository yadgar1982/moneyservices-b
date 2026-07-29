import {Schema,model}from "mongoose";
const brandingSchema = new Schema({
  companyName:{
    type:String,
    required:true,
    trim:true,
  },
  address:{
    type:String,
    trim: true,
  },
  email:{
    type:String,
    trim: true,
    lowercase:true,
  },
  mobile:{
    type: String,
    required:false,
    trime:true
  },
  logo:{
    type:String,
  },


},{timestamps:true});

export default model("branding",brandingSchema)