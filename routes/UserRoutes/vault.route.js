
import express from "express";
const vaultRouter = express.Router();

import {
  createVault,
  getAllVaults,
  getVaultById,
  getVaultByAcc,
  updateVault,
  deleteVault,
} from "../../Controller/vault.controller.js";

// Create a Vault record
vaultRouter.post("/create", createVault);

// Get all Vault records
vaultRouter.get("/read", getAllVaults);

// Get Vault record by transaction ID
vaultRouter.get("/readbyid/:id", getVaultById);

// Get Vault record by account number
vaultRouter.get("/readbyaccountno/:accountNo", getVaultByAcc);

// Update Vault record by transaction ID
vaultRouter.put("/update/:id", updateVault);

// Delete Vault record by transaction ID
vaultRouter.delete("/delete/:id", deleteVault);

export default vaultRouter;
