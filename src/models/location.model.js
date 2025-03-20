const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      latitude: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
        required: true,
      },
    },
    count: {
      type: Number,
      default: 0,
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

// add plugin that converts mongoose to json
locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);

const Location = mongoose.model("Location", locationSchema, "location");

module.exports = Location;
