import {Schema, model}from "mongoose"

const registerSchema= new Schema({
  fullname:{
    type:String,
    required:true,
    trim:true
  },
  accountNo:{
    type:String,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true
  },
  password:{
    type:String,
  },
  mobile:{
    type:Number,
    required:false,
    trim:true,
  },
 country:{
  type:String,
  required:false,
  trim: true,
 },
 address:{
  type:String,
  required:false,
 },
 branch:{
  type:String,
  required:false,
 },
 role:{
  type:String,
  required:true,
  lowercase:true
 },
 profile:{
  type:String,
 },
 otp:String,
 otpExpires:Date,

},{timestamps:true});

export default model("User",registerSchema)