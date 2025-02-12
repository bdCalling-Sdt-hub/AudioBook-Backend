const { Characters } = require("../models");

const addNewCharacters = async (characterBody) => {
  return Characters.create(characterBody);
};

const getAllCharacters = async () => {
  const characters = await Characters.find().populate({
    path: "audios",
    select: "-audioFile",
    populate: {
      path: "languageId",
      select: "name flagImage",
    },
  });
  return characters;
};

const getCharacterById = async (id) => {
  return Characters.findById(id);
};

module.exports = {
  addNewCharacters,
  getAllCharacters,
  getCharacterById,
};
