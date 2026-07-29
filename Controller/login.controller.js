import userSchema from "../Model/register.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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