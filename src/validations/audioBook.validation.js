const Joi = require("joi");

const addNewAudioBook = {
  body: Joi.object().keys({
    storyTitle: Joi.string().optional(),
    coverPhotos: Joi.array().items(Joi.string()).optional(),
    // audios: Joi.array().items(
    //   Joi.object().keys({
    //     audioFile: Joi.string().required(), // because this is file
    //     languageId: JoiObjectId().required().messages({
    //       "string.pattern.name": "Language ID must be a valid ObjectId.",
    //     }),
    //   })
    // ),

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

    // locationId: JoiObjectId().required().messages({
    //   "string.pattern.name": "Language ID must be a valid ObjectId.", // Custom message when the value is not a valid ObjectId
    // }),
  }),
};

module.exports = {
  addNewAudioBook,
};
