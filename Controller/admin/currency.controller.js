
import currencyModel from "../../Model/currency.model.js";


// create currency

export const create = async(req, res)=>{
  try{
    const data=req.body;

    if(!data){
      return res.status(400).json({
        success:false,
        msg:"Currency name is required"
      });
    }

    const existingCurrency=await currencyModel.findOne({data});
    if(existingCurrency){
      return res.status(400).json({
        success:false,
        msg:"Currency already exists",
      });
    }

    const newCurrency = new currencyModel(data);
    await newCurrency.save();
    return res.status(201).json({
      success:true,
      msg:"Currency created successfully",
      data:newCurrency
    });
  }catch(err){
    res.status(500).json({
      success:false,
      msg:"Internal Server error",
      error:err.message
    });
  }
}


// read currency
export const read=async(req,res)=>{

  try{
    const data=await currencyModel.find();
 return res.status(200).json({
      success:true,
      data:data
    })
   
   
  }catch(err){
    res.status(500).json({
      succes:false,
      msg:'Internal Server error',
      error:err.message
    })
  }

}


// update currency
export const update= async(req,res)=>{
  console.log("daata",req.body)
  try{
    const {id}=req.params;
    const data=req.body;
    console.log("data",data)
    const updatedData=await currencyModel.findByIdAndUpdate(id,data,{new:true});
    if(!updatedData){
      return res.status(404).json({
        success:false,
        msg:"Currency not foudn",
      })
    }
    return res.status(200).json({
      success:true,
      msg:"Currency updated successfully",
      data:updatedData
    });

  }catch(err){
    res.status(500).json({
      success:false,
      msg:"Internal Server error",
      error:err.message
    })
  }
}


// delete currency
export const deleteCurrency=async(req,res)=>{
  try{
    const {id}=req.params;
    await currencyModel.findByIdAndDelete(id);
    return res.status(200).json({
      success:true,
      msg:"Currency deleted successfully",

    })

  }catch(err){
    res.status(500).json({
      success:false,
      msg:"Unable to delete currency",
      error:err.message
    })
  }

}