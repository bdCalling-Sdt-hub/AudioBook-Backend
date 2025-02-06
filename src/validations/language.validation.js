const Joi = require("joi");

const addNewLanguage = {
  body: Joi.object().keys({
    flagImage: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

module.exports = {
  addNewLanguage,
};
