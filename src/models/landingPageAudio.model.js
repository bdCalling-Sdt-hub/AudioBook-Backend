const mongoose = require("mongoose");

const landingPageAudiosSchema = mongoose.Schema(
  {
    audioFile: {
      type: String,
      required: true,
    },
    languageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LandingPageAudios = mongoose.model(
  "LandingPageAudios",
  landingPageAudiosSchema,
  "landingPageAudios"
);

module.exports = LandingPageAudios;
