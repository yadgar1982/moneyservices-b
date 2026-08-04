import express from "express";
import {
  createBackup,
  getAllBackups,
restoreBackup,
 deleteBackup,
 downloadBackup,
} from "../../Controller/backup.controller.js";

const backupRouter = express.Router();

backupRouter.post("/create", createBackup);

// get
backupRouter.get("/", getAllBackups);

// restore
backupRouter.post("/restore/:id", restoreBackup);
// delete
backupRouter.delete("/:id", deleteBackup);
//download
backupRouter.get("/download/:id", downloadBackup);
export default backupRouter;