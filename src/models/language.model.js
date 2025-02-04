const { required } = require("joi");
const mongoose = require("mongoose");


const languageSchema = mongoose.Schema(
  {
    flagImage: {
        type: String,
        default: null,
    },
    name : {
        type: String,
        required :true,
    }
  },
  {
    timestamps: true,
  }
);



const language = mongoose.model("language", languageSchema);

module.exports = language;
