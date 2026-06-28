import express from "express";
const router=express.Router()

import {login} from "../../Controller/login.controller.js"

router.post("/login",login)
export default router;

