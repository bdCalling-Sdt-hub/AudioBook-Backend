const Joi = require("joi");

const updateLocation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    coordinates: Joi.object().keys({
      latitude: Joi.string().required(),
      longitude: Joi.string().required(),
    }),
  }),
};

module.exports = {
  updateLocation,
};
