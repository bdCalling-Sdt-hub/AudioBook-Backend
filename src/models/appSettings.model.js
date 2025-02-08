const mongoose = require("mongoose");

const appSettingsSchema = mongoose.Schema(
  {
    backgroundPhoto: {
      type: String,
      required: [true, "Image is must be Required"],
    },

    // TODO: Default value should be double checked - ms

    characterBtnPhoto: {
      type: String,
      required: [true, "Image is must be Required"],
    },
  },
  {
    timestamps: true,
  }
);

const AppSettings = mongoose.model(
  "AppSettings",
  appSettingsSchema,
  "appSettings"
);

module.exports = AppSettings;
