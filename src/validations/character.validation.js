const Joi = require("joi");
// const JoiObjectId = require("joi-objectid")(Joi);

const addNewCharacter = {
  body: Joi.object().keys({
    storyTitle: Joi.string().required(),

    // TODO : remove this audios because we upload audioes throw another api
    // audios: Joi.array().items(
    //   Joi.object().keys({
    //     audioFile: Joi.string().required(),
    //     languageId: JoiObjectId().required().messages({
    //       "string.pattern.name": "Language ID must be a valid ObjectId.",
    //     }),
    //   })
    // ),
    coverPhoto: Joi.string().optional(), // TODO : optional ke required kora jacche na
  }),
};

module.exports = {
  addNewCharacter,
};
