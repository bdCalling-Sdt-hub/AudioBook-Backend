const { required } = require("joi");
const mongoose = require("mongoose");
// TODO : Spotlyt kotha ta remove korte hobe .. email theke + readme theke
const languageSchema = mongoose.Schema(
  {
    flagImage: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;
