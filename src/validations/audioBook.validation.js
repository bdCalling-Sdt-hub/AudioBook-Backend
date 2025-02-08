const Joi = require("joi");
const JoiObjectId = require("joi-objectid")(Joi);

const addNewAudioBook = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),
    coverPhotos: Joi.array().items(Joi.string()),
    audios: Joi.array().items(
      Joi.object().keys({
        // audioFile: Joi.string().required(), // because this is file
        languageId: JoiObjectId().required().messages({
          "string.pattern.name": "Language ID must be a valid ObjectId.",
        }),
      })
    ),
    location: Joi.object().keys({
      name: Joi.string().required(),
      coordinates: Joi.object().keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    }),
  }),
};

module.exports = {
  addNewAudioBook,
};
