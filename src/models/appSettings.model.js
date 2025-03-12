const mongoose = require("mongoose");
// test 
const appSettingsSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is must be Required"],
    },
    type: {
      type: String,
      enum: ["backgroundPhoto", "characterBtnPhoto"],
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
