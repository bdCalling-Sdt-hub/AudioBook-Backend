const { Characters } = require("../models");

const addNewCharacters = async (characterBody) => {
  return Characters.create(characterBody);
};

const getAllCharacters = async (req, res) => {
  const query = {};
  query.published = true;

  const isPreviewFilter =
    req.query.isPreview !== undefined
      ? { isPreview: req.query.isPreview === "true" }
      : {};


  const characters = await Characters.find({ published: true }).populate({
    path: "audios",
    match: isPreviewFilter,
    select: "",
    populate: {
      path: "languageId",
      select: "name flagImage",
    },
  });
  
  /*
  const characters = await Characters.aggregate([
    // Match only published characters
    { $match: { published: true } },

    // Populate the `audios` field and filter out audios with null `languageId`
    {
      $lookup: {
        from: "audios", // Replace with the actual collection name for audios
        localField: "audios",
        foreignField: "_id",
        as: "audios",
        pipeline: [
          // Lookup to populate `languageId`
          {
            $lookup: {
              from: "languages", // Replace with the actual collection name for languages
              localField: "languageId",
              foreignField: "_id",
              as: "languageId",
            },
          },
          // Unwind the `languageId` array (since $lookup creates an array)
          { $unwind: "$languageId" },
          // Filter out audios where `languageId` is null or missing
          { $match: { "languageId": { $ne: null } } },
          // Project only the required fields for `audios`
          {
            $project: {
              _id: 1,
              languageId: { name: 1, flagImage: 1 }, // Include only `name` and `flagImage`
            },
          },
        ],
      },
    },

    // Filter out characters whose `audios` array is empty after the above filtering
    { $match: { audios: { $ne: [] } } },
  ]);
  */

  return characters;
};

const getCharacterById = async (id) => {
  return Characters.findById(id).populate({
    path: "audios",
    select: "",
    populate: {
      path: "languageId",
      select: "name flagImage ",
    },
  });
};

module.exports = {
  addNewCharacters,
  getAllCharacters,
  getCharacterById,
};
