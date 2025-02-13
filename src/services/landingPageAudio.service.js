const { LandingPageAudios } = require("../models");

const addNewAudio = async (languageBody) => {
  return LandingPageAudios.create({ ...languageBody });
};

const getAllAudio = async () => {
  const languages = await LandingPageAudios.find();
  return languages;
};

const getAAudioById = async (id) => {
  return LandingPageAudios.findById(id);
};

// Fix :  Eta fix korte hobe ....
const updateAudioById = async (id) => {
  return LandingPageAudios.findById(id);
};

module.exports = {
  addNewAudio,
  getAllAudio,
  getAAudioById,
  updateAudioById,
};
