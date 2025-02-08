const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const addNewLandingPageAudio = {
  body: Joi.object().keys({
    // audioFile: Joi.string().required(),  // FIX : how to add joi validation for req.file
    languageId: JoiObjectId().required().messages({
      // "any.required": "Language ID is required.", // Custom message when the field is missing
      // "string.base": "Language ID must be a string.", // Custom message when the value is not a string
      "string.pattern.name": "Language ID must be a valid ObjectId.", // Custom message when the value is not a valid ObjectId
    }), // Validate that languageId is a valid ObjectId
    // FIX : may be Joi.string() diye controller er moddhe language ta exist kore kina .. sheta check korte better hobe ..
  }),
};

module.exports = {
  addNewLandingPageAudio,
};
