const Joi = require("joi");

const addNewCharacter = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),
    audios: Joi.array().items(
      Joi.object().keys({
        audioFile: Joi.string().required(),
        languageId: Joi.string().required(), // TODO : issue thakte pare because this is reference ..
      })
    ),
    coverPhoto: Joi.string().optional(), // TODO : optional ke required kora jacche na
  }),
};

module.exports = {
  addNewCharacter,
};
