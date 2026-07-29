import jwt from "jsonwebtoken";
// import rateLimit from "express-rate-limit"

export const verifyToken = (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.authToken;
    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized. Token missing.",
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded User:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({
      msg: "Invalid or expired token.",
    });
  }
};
// allow isAdmin
export const isAdmin=(req,res,next)=>{
  if(req.user?.role !== "admin"){
    console.log("role",req.user.role)
    return res.status(403).json({msg:"Access Denied: Not authorized"})
  }
  next();
};
// Allow Only user
export const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Access denied: Not authorized" });
  }
  return next();
};