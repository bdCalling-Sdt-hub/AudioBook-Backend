const httpStatus = require("http-status");
const { Language } = require("../models");
const ApiError = require("../utils/ApiError");

const addNewLanguage = async (languageBody) => {
  return Language.create({ ...languageBody });
};

const getAllLanguage = async () => {
  const languages = await Language.find();
  return languages;
};

// const getCharacterById = async (id) => {
//   return Characters.findById(id);
// };

module.exports = {
  addNewLanguage,
  getAllLanguage,
};
