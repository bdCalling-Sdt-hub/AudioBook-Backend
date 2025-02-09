const mongoose = require("mongoose");

const charactersSchema = mongoose.Schema(
  {
    storyTitle: {
      type: String,
      required: true,
    },
    audios: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the AudioFile model
        ref: "AudioFile", // The name of the referenced model
        required: true,
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
