const mongoose = require("mongoose");


const landingPageAudiosSchema = mongoose.Schema(
  {
    audioFile: {
        type: String,
        required: true,
    },
    languageId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
    }
  },
  {
    timestamps: true,
  }
);



const landingPageAudios = mongoose.model("landingPageAudios", landingPageAudiosSchema);

module.exports = landingPageAudios;
