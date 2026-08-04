import express from "express";
const router=express.Router()

import {login,session,logout, forgetPassword,verifyOTP,resetPassword} from "../../Controller/login.controller.js"
import { verifyToken } from "../../Middleware/auth.middleware.js";

router.post("/login",login);
router.post("/logout",logout);


router.post("/forgot-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.get("/session",verifyToken,session);

export default router;

