
import branchModel from "../../Model/branch.model.js";


// create branch

export const create = async(req, res)=>{
  try{
    const data=req.body;

    if(!data){
      return res.status(400).json({
        success:false,
        msg:"Branch name is required"
      });
    }

    const existingbranch=await branchModel.findOne({data});
    if(existingbranch){
      return res.status(400).json({
        success:false,
        msg:"Branch already exists",
      });
    }

    const newBranch = new branchModel(data);
    await newBranch.save();
    return res.status(201).json({
      success:true,
      msg:"Branch created successfully",
      data:newBranch
    });
  }catch(err){
    res.status(500).json({
      success:false,
      msg:"Internal Server error",
      error:err.message
    });
  }
}


// read branch
export const read=async(req,res)=>{

  try{
    const data=await branchModel.find();
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


// update branch
export const update= async(req,res)=>{
  console.log("daata",req.body)
  try{
    const {id}=req.params;
    const data=req.body;
    console.log("data",data)
    const updatedData=await branchModel.findByIdAndUpdate(id,data,{new:true});
    if(!updatedData){
      return res.status(404).json({
        success:false,
        msg:"branch not foudn",
      })
    }
    return res.status(200).json({
      success:true,
      msg:"Branch updated successfully",
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


// delete branch
export const deleteBranch=async(req,res)=>{
  try{
    const {id}=req.params;
    await branchModel.findByIdAndDelete(id);
    return res.status(200).json({
      success:true,
      msg:"Branch deleted successfully",

    })

  }catch(err){
    res.status(500).json({
      success:false,
      msg:"Unable to delete branch",
      error:err.message
    })
  }

}