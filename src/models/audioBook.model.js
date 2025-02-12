const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const audioBookSchema = mongoose.Schema(
  {
    storyTitle: {
      type: String,
      required: false,
    },
    coverPhotos: {
      type: [String],
      default: [],
    },
    audios: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the AudioFile model
        ref: "AudioFile", // The name of the referenced model
        required: false,
      },
    ],
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false,
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

// add plugin that converts mongoose to json
audioBookSchema.plugin(toJSON);
audioBookSchema.plugin(paginate);

const AudioBook = mongoose.model("AudioBook", audioBookSchema, "audioBooks");

module.exports = AudioBook;
