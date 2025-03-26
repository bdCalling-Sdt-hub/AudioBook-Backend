const mongoose = require("mongoose");

const audioFileSchema = mongoose.Schema(
  {
    audioFile: {
      type: String,
      required: true,
    },
    languageId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Language model
      ref: "Language", // The name of the referenced model
      required: true,
    },
    attachedTo: {
      type: String,
      required: false,
    },
    isPreview: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AudioFile = mongoose.model("AudioFile", audioFileSchema, "audioFile");

module.exports = AudioFile;
