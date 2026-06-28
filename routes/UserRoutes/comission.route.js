import express from "express";
const comissionRouter = express.Router();

import {
createComission,
getAllComissions,
getComissionByAcc,
getComissionById,
updateComission,
deleteComission,

 
} from "../../Controller/comission.controller";

// Create a comissions
comissionRouter.post(  "/create", createComission);

// Get all comissions
comissionRouter.get('/read', getAllComissions);

// Get all comissions
comissionRouter.get('/readbyid/:id', getComissionById);


// Delete a comissions by ID
comissionRouter.put("/update/:id", updatecomission);
// Delete a comissions by ID
comissionRouter.delete('/delete/:id', deletecomission);

// Update comissions by Account Number
comissionRouter.put('/updatebyaccountno/:accountNo', updatecomissionByAccountNo);

// Get comissions by Account Number
comissionRouter.get('/getbyaccountno/:accountNo', getcomissionByAccountNo);

export default comissionRouter;
