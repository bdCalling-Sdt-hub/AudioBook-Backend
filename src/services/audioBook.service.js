const httpStatus = require("http-status");
const AudioBook = require("../models/audioBook.model");
const ApiError = require("../utils/ApiError");

const createAudioBook = async (audioBookData) => {
  return await AudioBook.create(audioBookData);
};

module.exports = {
  createAudioBook,
};
