const Joi = require("joi");
// const JoiObjectId = require("joi-objectid")(Joi);

const addNewCharacter = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),
    coverPhoto: Joi.string().optional(), // TODO : optional ke required kora jacche na
  }),
};

module.exports = {
  addNewCharacter,
};
