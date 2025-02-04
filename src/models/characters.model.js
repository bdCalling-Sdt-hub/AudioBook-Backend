const { required } = require("joi");
const mongoose = require("mongoose");


const charactersSchema = mongoose.Schema(
  {

    storyTitle : {
        type: string,
        required :true,
    },
    audios :[
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
      type: string,
      default: null,
  },
  },
  {
    timestamps: true,
  }
);



const characters = mongoose.model("characters", charactersSchema);

module.exports = characters;
