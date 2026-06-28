import express from 'express';
const currencyRouter = express.Router();

import{
  create,read,update,deleteCurrency
}from "../../Controller/admin/currency.controller.js";


//Currency creattion route
//Private
//POST /api/currency/create

currencyRouter.post('/create',create);

//Currency read route
//Private
//POST /api/currency/read

currencyRouter.get('/read',read);

//Currency update route
//Private
//POST /api/currency/update
currencyRouter.put('/update/:id',update);

//Currency delete route
//Private
//POST /api/currency/delete

currencyRouter.delete('/delete/:id',deleteCurrency);


export default currencyRouter;