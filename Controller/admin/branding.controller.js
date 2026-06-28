import brandingModel from "../../Model/branding.model.js";
import fs from "fs";
import path from "path";
// create branding
export const create = async (req, res) => {
  try {
    const data = req.body;
    console.log("data",data)

     const logo = req.file ? `/brandingLogo/${req.file.filename}` : null;
    console.log("logo image", logo);
    const newBranding = await new brandingModel({ ...data, logo }).save();

    return res.status(201).json({
      success: true,
      msg: "Branding saved successfully",
      data: newBranding,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal Srver error",
      error: err.message,
    });
  }
};

// update branding

// export const update = async (req, res) => {
//   try {

// console.log("ROUTE HIT");
//     console.log("PARAM:",req.params);
//     console.log("BODY:",req.body);
//     console.log("FILE:",req.file);


//     const { id } = req.params;
//     const data = { ...req.body };
  
//     if (req.file){
//       data.logo=`/brandingLogo/${req.file.filename}`;
//     }


//     delete data.name;
//     const updatedData = await brandingModel.findByIdAndUpdate(id, data, {
//       new: true,
//     });
   
//       res.status(200).json({
//       msg: "Branding Updated Successfully",
//       success: true,
//       data: updatedData,
      
//     });

 
//   } catch (err) {
//     res.status(500).json({
//       msg: "Unable to update brandin",
//       success: false,
//       error: err.message,
//     });
//   }
// };

export const update = async (req,res)=>{
 try{

  const {id} = req.params;

  const existingBrand =
    await brandingModel.findById(id);

  const data = {...req.body};

  if(req.file){

    if(existingBrand.logo){

      // get filename only
      const oldFileName =
        existingBrand.logo.split("/").pop();

      // correct folder path
      const oldFilePath =
        path.join(
          process.cwd(),
          "uploads",
          "logoUpload",   
          oldFileName
        );

      console.log("DELETE PATH:",oldFilePath);

      if(fs.existsSync(oldFilePath)){
        fs.unlinkSync(oldFilePath);
        console.log("OLD FILE REMOVED");
      }else{
        console.log("OLD FILE NOT FOUND");
      }

    }

    // save new file path (must match folder)
    data.logo = `/brandingLogo/${req.file.filename}`;

  }

  const updated =
    await brandingModel.findByIdAndUpdate(
      id,
      data,
      {new:true}
    );

  res.status(200).json({
    msg:"Branding Updated Successfully",
    success:true,
    data:updated
  });

 }catch(err){

  console.log(err);

  res.status(500).json({
    error:err.message
  });

 }
};
// Delete

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
      const existingBrand = await brandingModel.findById(id);

      if (!existingBrand) {
      return res.status(404).json({
        success: false,
        msg: "Branding not found",
      });
    }
    let oldFilePath = "";

    if (existingBrand.logo) {
      const oldFileName = existingBrand.logo.split("/").pop();

      oldFilePath = path.join(
        process.cwd(),
        "uploads",
        "logoUpload",
        oldFileName
      );

    
    console.log("delete path:", oldFilePath);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("OLD FILE REMOVED");
      } else {
        console.log("OLD FILE NOT FOUND");
      }
    }

    await brandingModel.findByIdAndDelete(id);
    
   

    return res.status(200).json({
      msg: "Branding deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unable to delete data" },err.message);
  }
};


//Read

export const read = async(req,res)=>{
  try{
    const data = await brandingModel.find().sort({createdAt:-1});
    res.status(200).json({
      success:true,
      data
    })
  }catch(err){
   res.status(500).json({
      msg:"Unable to fetch data",
      error:err.message
    });
  }
}
