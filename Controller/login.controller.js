import userSchema from "../Model/register.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import otpEmailTemplate from "../templates/otpEmailTemplate.js";
import {sendEmail}from "../config/nodmailer.js";
import Register from "../Model/register.model.js"

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and Password are required",
      });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({
        msg: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        msg: "Invalid Credentials",
      });
    }

    const payload = {
      email: user.email,
      role: user.role,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

   res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 4 * 60 * 60 * 1000,
        path: "/",
      });

    const safeUser = await userSchema
      .findById(user._id)
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Session
export const session = async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    return res.json({
      authenticated: true,
      user,
    });
  } catch (err) {
    return res.status(401).json({
      authenticated: false,
    });
  }
};

// Logout
export const logout = (req, res) => {
res.clearCookie("authToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// forget Password
// export const forgetPassword = async (req, res) => {
//     try{
//         const {email}=req.body

//         if(!email){
//             return res.status(400).json({
//                 success:false,
//                 message:"Email is required",
//             });
//         }

//         const user=await Register.findOne({
//             email:email.toLowerCase().trim(),
//         });

//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:"No account found with this Email."
//             });
//         }
//     // generate otp
//         const otp = generateOTP();
//        // Save OTP
//         user.otp=otp;
//         user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//         await user.save();
//         // send email
//         await sendEmail({
//             to:user.email,
//             subject:"Password Reset OTP",
//             html: otpEmailTemplate({
//                 name: user.fullname || "User",
//                 otp,
//             }),
//         });

//         return res.status(200).json({
//             success:true,
//             message:"OTP sent successfully"
//         });

//     }catch(err){
//         console.error("Forot Password Error",err);
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong",
//         });

//     }
// };

export const forgetPassword = async (req, res) => {
  try {
    console.log("1. Forgot password request received");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("2. Looking for user...");

    const user = await Register.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this Email.",
      });
    }

    console.log("3. User found:", user.email);

    const otp = generateOTP();

    console.log("4. Generated OTP:", otp);

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    console.log("5. OTP saved");

    console.log("6. Sending email...");

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: otpEmailTemplate({
        name: user.fullname || "User",
        otp,
      }),
    });

    console.log("7. Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// VerifyOtp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await Register.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    // Mark OTP as verified
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await Register.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your OTP first.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Clear reset information
    user.otp = null;
    user.otpExpires = null;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};