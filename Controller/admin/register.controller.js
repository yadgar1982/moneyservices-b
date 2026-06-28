import bcrypt from "bcryptjs";
import userSchema from "../../Model/register.model.js";
import fs from "fs/promises";
import path from "path";


// create user
export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const isUser = await userSchema.findOne({ email: data.email });
    if (isUser) {
      return res.status(400).json({ msg: "User already exist" });
    }
  

    const profile = req.file ? `/userProfile/${req.file.filename}` : null;
    console.log("profile image", profile);
   
    // hash password
  const defaultPassword = "123456";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const user = await new userSchema({
      ...data, // allowed fields only
      password: hashedPassword,
      profile,
    }).save();
    res.status(200).json({
      msg: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
    console.log("err", err);
  }
};

//get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find().sort({ _id: -1 });
    res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" + err.message });
  }
};

//get user by email:

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await userSchema.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(404).json(user);
  } catch (err) {
    res.status(500).json({ msg: "user does not exist" });
  }
};

// update user

export const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    const id = req.params.id;

    delete data._id;

    // Get existing user FIRST (to access old image)
    const existingUser = await userSchema.findById(id);

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If new file uploaded → delete old file
    if (req.file) {
      if (existingUser.profile) {
        const oldPath = path.join(
          process.cwd(),
          "uploads/userUpload",
          path.basename(existingUser.profile)
        );

        await fs.unlink(oldPath).catch(() => {
          console.log("Old file not found or already deleted");
        });
      }

      // save new file path
      data.profile = `/userProfile/${req.file.filename}`;
    }

    // Update user (same as your logic)
    const user = await userSchema.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
      msg: "User updated successfully",
      data: user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update user", err });
  }
};

// Update by email
export const updateByEmial = async (req, res) => {
  try {
    const email = req.params.email;
    const data = { ...req.body };

    if (!email) return res.status(400).json({ msg: "Email is required" });
    if (!data || Object.keys(data).lenght === 0)
      return res.status(400).json({ msg: "No data is provided for update" });

    if (data.password && data.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcript.hash(data.password, salt);
      data.password = hashedPassword;
    } else {
      delete data.password;
    }

    if (req.file) {
      data.profile = `/usrProfile/${req.file.filename}`;
    }
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const user = await userSchema.findOne({ email }, data, { new: true });
    return res.status(200).sjon({
      msg: "user updated successuflly",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ msg: "Faield to update user", err });
  }
};

// delete user


export const deleteUser=async(req,res)=>{
  try{
    const {id}=req.params;
    const user= await userSchema.findById(id);
    if(!user){
      return res.status(404).json({msg:"User not found"});
    }

    if (user.profile){
      const filePath=path.join(
        process.cwd(),
        "uploads/userUpload",
        path.basename(user.profile)
      );
      try{
        await fs.unlink(filePath);
      }catch(err){
        console.log("Image not found or already deleted")
      }
    }

    await userSchema.findByIdAndDelete(id);
    return res.status(200).json({msg:"User deleted successfully"})

  }catch(err){
    console.error(err)
    res.status(500).json({msg:"Failed to delet user"})

  }

}
// delete user by email
export const deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userSchema.findOneAndDelete({ email });
    if (!user) {
      res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: "failed to Delete user", err });
  }
};
