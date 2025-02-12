const { Language } = require("../models");

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
