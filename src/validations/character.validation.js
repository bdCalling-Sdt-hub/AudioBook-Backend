const Joi = require("joi");

const addNewCharacter = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),
    coverPhoto: Joi.string().optional(), // Issue : cant apply required to this field
  }),
};

module.exports = {
  addNewCharacter,
};
