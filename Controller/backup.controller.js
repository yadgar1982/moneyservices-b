import fs from "fs";
import path from "path";
import Backup from "../Model/backup.model.js";
import User from "../Model/register.model.js";
import Transaction from "../Model/transaction.model.js";
import Currency from "../Model/currency.model.js";
import Branch from "../Model/branch.model.js";
import Comission from "../Model/comission.model.js";
import Branding from "../Model/branding.model.js";
import AutoBackup from "../Model/autoBackup.model.js";
import { zip } from "zip-a-folder";


// create backup
export const createBackup = async (req, res) => {
  try {
    const backup = await createScheduledBackup("Admin");

    res.status(200).json({
      success: true,
      message: "Backup created successfully.",
      backup,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createScheduledBackup = async (createdBy = "System") => {
  try {
    // Read all collections
    const users = await User.find().lean();
    const transactions = await Transaction.find().lean();
    const currencies = await Currency.find().lean();
    const branches = await Branch.find().lean();
    const commissions = await Comission.find().lean();
    const brandings = await Branding.find().lean();

    const backupName = `Backup-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}`;

    const backupDir = path.join(process.cwd(), "backups", backupName);

    fs.mkdirSync(backupDir, { recursive: true });

    fs.writeFileSync(
      path.join(backupDir, "users.json"),
      JSON.stringify(users, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, "transactions.json"),
      JSON.stringify(transactions, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, "currencies.json"),
      JSON.stringify(currencies, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, "branches.json"),
      JSON.stringify(branches, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, "commissions.json"),
      JSON.stringify(commissions, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, "brandings.json"),
      JSON.stringify(brandings, null, 2)
    );

    const backup = await Backup.create({
      backupName,
      folder: backupName,
      createdBy,
      totalCollections: 6,
      totalRecords:
        users.length +
        transactions.length +
        currencies.length +
        branches.length +
        commissions.length +
        brandings.length,
      status: "Completed",
    });


// Remove old backups based on retention
const settings = await AutoBackup.findOne();

if (settings && settings.retention > 0) {
  const backups = await Backup.find().sort({ createdAt: -1 });

  if (backups.length > settings.retention) {
    const oldBackups = backups.slice(settings.retention);

    for (const oldBackup of oldBackups) {
      const oldFolder = path.join(
        process.cwd(),
        "backups",
        oldBackup.folder
      );

      if (fs.existsSync(oldFolder)) {
        fs.rmSync(oldFolder, {
          recursive: true,
          force: true,
        });
      }

      await Backup.findByIdAndDelete(oldBackup._id);

      console.log(`Deleted old backup: ${oldBackup.backupName}`);
    }
  }
}
    return backup;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// get backups
export const getAllBackups = async (req, res) => {
  try {
    const backups = await Backup.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      backups,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Restore backup

export const restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found.",
      });
    }

    const backupDir = path.join(process.cwd(), "backups", backup.folder);

    // Verify backup folder exists
    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({
        success: false,
        message: `Backup folder '${backup.folder}' not found.`,
      });
    }

    // Helper function to safely read JSON files
    const readBackupFile = (fileName) => {
      const filePath = path.join(backupDir, fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error(`${fileName} is missing from the backup.`);
      }

      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    };

    // Read all collections
    const users = readBackupFile("users.json");
    const transactions = readBackupFile("transactions.json");
    const currencies = readBackupFile("currencies.json");
    const branches = readBackupFile("branches.json");
    const commissions = readBackupFile("commissions.json");
    const brandings = readBackupFile("brandings.json");

    // Clear database
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Currency.deleteMany({});
    await Branch.deleteMany({});
    await Comission.deleteMany({});
    await Branding.deleteMany({});

    // Restore collections
    if (users.length) await User.insertMany(users);
    if (transactions.length) await Transaction.insertMany(transactions);
    if (currencies.length) await Currency.insertMany(currencies);
    if (branches.length) await Branch.insertMany(branches);
    if (commissions.length) await Comission.insertMany(commissions);
    if (brandings.length) await Branding.insertMany(brandings);

    res.status(200).json({
      success: true,
      message: "Database restored successfully.",
      restored: {
        users: users.length,
        transactions: transactions.length,
        currencies: currencies.length,
        branches: branches.length,
        commissions: commissions.length,
        brandings: brandings.length,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete
export const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found",
      });
    }

    const backupDir = path.join(process.cwd(), "backups", backup.folder);

    // Delete backup folder
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, {
        recursive: true,
        force: true,
      });
    }

    // Delete backup record
    await Backup.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Backup deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// download
export const downloadBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await Backup.findById(id);

    if (!backup) {
      return res.status(404).json({
        success: false,
        message: "Backup not found.",
      });
    }

    const backupDir = path.join(process.cwd(), "backups", backup.folder);

    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({
        success: false,
        message: "Backup folder not found.",
      });
    }

    const zipPath = path.join(
      process.cwd(),
      "backups",
      `${backup.folder}.zip`
    );

    await zip(backupDir, zipPath);

    res.download(zipPath, `${backup.folder}.zip`, (err) => {
      if (!err && fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath); // Delete the temporary ZIP after download
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};