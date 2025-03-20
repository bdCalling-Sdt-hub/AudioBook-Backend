const mongoose = require("mongoose");

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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;
