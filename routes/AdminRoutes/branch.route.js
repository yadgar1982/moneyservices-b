import express from 'express';
const branchRouter = express.Router();

import{
  create,read,update,deleteBranch
}from "../../Controller/admin/branch.controller.js";


//Branch creattion route
//Private
//POST /api/branch/create

branchRouter.post('/create',create);

//Branch read route
//Private
//POST /api/branch/read

branchRouter.get('/read',read);

//Branch update route
//Private
//POST /api/branch/update
branchRouter.put('/update/:id',update);

//Branch delete route
//Private
//POST /api/branch/delete

branchRouter.delete('/delete/:id',deleteBranch);


export default branchRouter;