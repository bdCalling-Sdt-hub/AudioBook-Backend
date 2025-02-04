const { required } = require("joi");
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
  },
  {
    timestamps: true,
  }
);



const audioFile = mongoose.model("audioFile", audioFileSchema);

module.exports = audioFile;
