const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const addNewAudioBook = {
  body: Joi.object().keys({
    storyTitle: Joi.string().optional(),
    coverPhotos: Joi.array().items(Joi.string()).optional(),

    location: Joi.object().keys({
      name: Joi.string().required(),
      coordinates: Joi.object()
        .keys({
          latitude: Joi.string().required(),
          longitude: Joi.string().required(),
        })
        .optional(),
    }),
    // TODO : location er case e relationship thakbe kina .. chinta korte hobe ..
    // UPdate : location er jonno alada db table create kora hoise .. check dite hobe ..

    // locationId: JoiObjectId().required().messages({
    //   "string.pattern.name": "Language ID must be a valid ObjectId.", // Custom message when the value is not a valid ObjectId
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
  addNewAudioBook,
  addAudioWithLanguageIdForAudioBook,
};
