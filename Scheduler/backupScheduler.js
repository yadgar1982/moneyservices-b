import cron from "node-cron";
import AutoBackup from "../Model/autoBackup.model.js";
import { createScheduledBackup } from "../Controller/backup.controller.js";

console.log("✅ Backup Scheduler Started");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking scheduler...");

  try {
    const settings = await AutoBackup.findOne();

    console.log("Settings:", settings);

    if (!settings) {
      console.log("No settings found");
      return;
    }

    if (!settings.enabled) {
      console.log("Automatic backup disabled");
      return;
    }

    const now = new Date();

    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    console.log("Current:", currentTime);
    console.log("Saved:", settings.time);

    if (currentTime !== settings.time) {
      console.log("Time doesn't match");
      return;
    }

    console.log("📦 Creating backup...");

    await createScheduledBackup();

    console.log("✅ Backup created");

  } catch (err) {
    console.error(err);
  }
});