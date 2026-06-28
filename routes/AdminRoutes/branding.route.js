import express from "express"
import { verifyToken,isAdmin } from "../../Middleware/auth.middleware.js";
import {
  create,
  update,
  remove,
  read
} from "../../Controller/admin/branding.controller.js"
import { upload } from "../../Middleware/uploadMiddleware.js";


const brandingRouter=express.Router();

// @ Route POST /api/branding/create
brandingRouter.post('/create',upload.single("logo"), create);



// @ Route POST /api/branding/read
brandingRouter.get('/read', read);


// @ Route PUT /api/branding/update
brandingRouter.put('/update/:id',upload.single("logo"), update);

// @ Route DELETe /api/branding/remove
brandingRouter.delete('/delete/:id', remove);

export default brandingRouter;

