import express from "express";
import { upload } from "../../Middleware/uploadMiddleware.js";
const userRouter=express.Router();

import{
  createUser,
  getAllUsers,
  updateUser,
  updateByEmial,
  getUserByEmail,
  deleteUser
}from "../../Controller/admin/register.controller.js"

// User Registeration route
// Privete
// POST /api/user/create
userRouter.post("/create", upload.single("profile"), createUser);

// User Registeration route
// Privete
// GET /api/user/read
userRouter.get('/read',getAllUsers);

// User Registeration route
// Privete
// PUT /api/user/update
userRouter.put(
  "/update/:id",
  upload.single("profile"),
  updateUser
);

// User Registeration route
// Privete
// PUT /api/user/delete
userRouter.delete('/delete/:id',deleteUser);

// User Registeration route
// Privete
// PUT /api/user/delete
userRouter.put('/updatebyemail/:email',updateByEmial);

// User Registeration route
// Privete
// PUT /api/user/delete
userRouter.get('/getbyemail/:email',getUserByEmail);

export default userRouter;