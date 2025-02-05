const mongoose = require("mongoose");

const appSettingsSchema = mongoose.Schema(
  {
    backgroundPhoto: {
      type: String,
      required: [true, "Image is must be Required"],
      default: { url: `/uploads/users/user.png`, path: "null" },
    },

    // TODO: Default value should be double checked - ms

    characterBtnPhoto: {
      type: String,
      required: [true, "Image is must be Required"],
      default: { url: `/uploads/users/user.png`, path: "null" },
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
