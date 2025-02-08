const Joi = require("joi");

const addNewLandingPageAudio = {
  body: Joi.object().keys({
    audioFile: Joi.string().required(),
    languageId: Joi.string().required(),
  }),
};

module.exports = {
  addNewLandingPageAudio,
};
