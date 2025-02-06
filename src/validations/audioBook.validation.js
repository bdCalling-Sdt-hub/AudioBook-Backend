const Joi = require("joi");

const addNewAudioBook = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),
    coverPhotos: Joi.array().items(Joi.string()),
    audios: Joi.array().items(
      Joi.object().keys({
        audioFile: Joi.string().required(),
        languageId: Joi.string().required(), // TODO : issue thakte pare because this is reference ..
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
