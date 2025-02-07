const httpStatus = require("http-status");
const AudioFile = require("../models/audioFile.model");
const ApiError = require("../utils/ApiError");

const createAudioFile = async (audioFileData) => {
  return await AudioFile.create(audioFileData);
};

module.exports = {
  createAudioFile,
};
