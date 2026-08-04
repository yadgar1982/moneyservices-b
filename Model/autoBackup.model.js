import mongoose from "mongoose";

const autoBackupSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },

    time: {
      type: String,
      default: "02:00",
    },

    retention: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AutoBackup", autoBackupSchema);