const mongoose = require("mongoose");

const charactersSchema = mongoose.Schema(
  {
    storyTitle: {
      type: String,
      required: false,
    },
    audios: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the AudioFile model
        ref: "AudioFile", // The name of the referenced model
        required: false,
      },
    ],

    coverPhoto: {
      type: String,
      default: null,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Characters = mongoose.model("Characters", charactersSchema);

module.exports = Characters;
