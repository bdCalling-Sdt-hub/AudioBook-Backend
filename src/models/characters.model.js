const { required } = require("joi");
const mongoose = require("mongoose");

const charactersSchema = mongoose.Schema(
  {
    storyTitle: {
      type: String,
      required: true,
    },
    audios: [
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
    ],

    coverPhoto: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Characters = mongoose.model("Characters", charactersSchema);

module.exports = Characters;
