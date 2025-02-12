const AudioFile = require("../models/audioFile.model");

const createAudioFile = async (audioFileData) => {
  return await AudioFile.create(audioFileData);
};

module.exports = {
  createAudioFile,
};
