const httpStatus = require("http-status");
const { Characters } = require("../models");
const ApiError = require("../utils/ApiError");

const addNewCharacters = async (characterBody) => {
  return Characters.create(characterBody);
};

const getAllCharacters = async () => {
  const characters = await Characters.find().populate({
    path: "audios", // Populate the 'audios' field
    select: "-audioFile", // Exclude the 'audioFile' field
    populate: {
      path: "languageId", // Populate the 'languageId' field with the Language document
      select: "name flagImage", // Include only specific fields from the Language model
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
