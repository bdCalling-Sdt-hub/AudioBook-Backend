const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const updateAudioBook = {
  body: Joi.object().keys({
    storyTitle: Joi.string().optional(),
    coverPhotos: Joi.array().items(Joi.string()).optional(),
    // TODO: FIXME: locationId issue kortese .. 
    locationId: Joi.string(),
    // locationId: JoiObjectId().optional().messages({
    //   "string.pattern.name": "LocationId ID must be a valid ObjectId.", // Custom message when the value is not a valid ObjectId
    // }),
  }),
};

const addAudioWithLanguageIdForAudioBook = {
  body: Joi.object().keys({
    languageId: JoiObjectId().required().messages({
      "string.pattern.name": "Language ID must be a valid ObjectId.",
    }),
  }),
};

module.exports = {
  updateAudioBook,
  addAudioWithLanguageIdForAudioBook,
};
