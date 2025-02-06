const httpStatus = require("http-status");
const { Characters } = require("../models");
const ApiError = require("../utils/ApiError");

const addNewCharacters = async (characterBody) => {
  return Characters.create(characterBody);
};

const getAllCharacters = async () => {
  const characters = await Characters.find();
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
