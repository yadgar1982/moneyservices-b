import jwt from "jsonwebtoken";
// import rateLimit from "express-rate-limit"

export const verifyToken=(req,res,next)=>{
  try{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
      return res.status(401).json({msg:"Unauthorized. Token missing."});
      
    }
      const token=authHeader.split(" ")[1];
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      req.user=decoded; 
      next();
  }catch(err){
    return res.status(401).json({msg:"Invalid or expired token."});
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