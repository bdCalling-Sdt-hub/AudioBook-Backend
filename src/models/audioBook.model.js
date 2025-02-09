const { required } = require("joi");
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

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
        type: mongoose.Schema.Types.ObjectId, // Reference to the AudioFile model
        ref: "AudioFile", // The name of the referenced model
        required: true,
      },
    ],
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },

    // location: {
    //   name: {
    //     type: String,
    //     required: true,
    //   },
    //   coordinates: {
    //     latitude: {
    //       type: String,
    //       required: true,
    //     },
    //     longitude: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // },
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
