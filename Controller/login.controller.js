import userSchema from "../Model/register.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const login=async(req,res)=>{
  try{
    const {email,password}=req.body
    if (!email || !password){
      return res.status(400).json({msg:"Email and Password are requied"})

    }

    const user=await userSchema.findOne({email})
    if(!user){
      return res.status(401).json({msg:"Invalid Credentials"})
    }

    const isMatch= await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(401).json({msg:"Invalid Credentials"});
    }

    const payload={
      email:user.email,
      role: user.role,
      id:user._id
    }

    const token =await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '4h',

    });
    res.status(200).json({
      message:"Login successful",
      token,
      user:user,
    })


  }catch(err){
     res.status(500).json({
      message:"server error",
      error:err.message
    })
  }
}

