const httpStatus = require("http-status");
const AudioBook = require("../models/audioBook.model");
const ApiError = require("../utils/ApiError");

const createAudioBook = async (audioBookData) => {
  return await AudioBook.create(audioBookData);
};

const queryAudioBooks = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (key === "storyTitle" && filter[key] !== "") {
      // key === "email" || key === "username"
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const audioBooks = await AudioBook.paginate(query, options);

  // Convert height and age to feet/inches here...

  return audioBooks;
};

module.exports = {
  createAudioBook,
  queryAudioBooks,
};
