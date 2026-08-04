import AutoBackup from "../Model/autoBackup.model.js";

// Get settings
export const getAutoBackupSettings = async (req, res) => {
  try {
    let settings = await AutoBackup.findOne();

    if (!settings) {
      settings = await AutoBackup.create({
        enabled: false,
        frequency: "daily",
        time: "02:00",
        retention: 30,
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Save settings
export const saveAutoBackupSettings = async (req, res) => {
  try {
    const { enabled, frequency, time, retention } = req.body;

    let settings = await AutoBackup.findOne();

    if (!settings) {
      settings = await AutoBackup.create({
        enabled,
        frequency,
        time,
        retention,
      });
    } else {
      settings.enabled = enabled;
      settings.frequency = frequency;
      settings.time = time;
      settings.retention = retention;

      await settings.save();
    }

    res.json({
      success: true,
      settings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};