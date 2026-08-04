import express from "express";
import {
  getAutoBackupSettings,
  saveAutoBackupSettings,
} from "../../Controller/autoBackup.controller.js";

const router = express.Router();

// Get current settings
router.get("/", getAutoBackupSettings);

// Save settings
router.put("/", saveAutoBackupSettings);

export default router;