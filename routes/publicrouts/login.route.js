import express from "express";
const router=express.Router()

import {login,session,logout} from "../../Controller/login.controller.js"
import { verifyToken } from "../../Middleware/auth.middleware.js";

router.post("/login",login)
router.post("/logout",logout)

router.get("/session",verifyToken,session)
export default router;

