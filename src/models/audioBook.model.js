const { required } = require("joi");
const mongoose = require("mongoose");

const audioBookSchema = mongoose.Schema(
  {
    storyTitle: {
      type: String,
      required: true,
    },
    coverPhotos: {
      type: [String],
      default: [], 
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
    location: {
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const AudioBook = mongoose.model("AudioBook", audioBookSchema, "audioBooks");

module.exports = AudioBook;
