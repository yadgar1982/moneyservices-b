import mongoose from "mongoose";

const backupSchema = new mongoose.Schema(
  {
    backupName: {
      type: String,
      required: true,
    },

    folder: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      default: "System",
    },

    totalCollections: {
      type: Number,
      default: 0,
    },

    totalRecords: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Backup", backupSchema);