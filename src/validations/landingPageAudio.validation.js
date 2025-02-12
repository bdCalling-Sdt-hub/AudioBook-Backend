const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const addNewLandingPageAudio = {
  body: Joi.object().keys({
    // audioFile: Joi.string().required(),  // FIX : how to add joi validation for req.file
    languageId: JoiObjectId().required().messages({
      "string.pattern.name": "Language ID must be a valid ObjectId.",
    }),
    // FIX : may be Joi.string() diye controller er moddhe language ta exist kore kina .. sheta check korte better hobe ..
  }),
};

module.exports = {
  addNewLandingPageAudio,
};
