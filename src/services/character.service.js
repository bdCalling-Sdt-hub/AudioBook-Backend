const { Characters } = require("../models");

const addNewCharacters = async (characterBody) => {
  return Characters.create(characterBody);
};

const getAllCharacters = async () => {
  const characters = await Characters.find({ published: true }).populate({
    path: "audios",
    select: "",
    populate: {
      path: "languageId",
      select: "name flagImage",
    },
  });
  return characters;
};

const getCharacterById = async (id) => {
  return Characters.findById(id).populate({
    path: "audios",
    select: "",
    populate: {
      path: "languageId",
      select: "name flagImage",
    },
  });;
};

module.exports = {
  addNewCharacters,
  getAllCharacters,
  getCharacterById,
};
