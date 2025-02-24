const AudioBook = require("../models/audioBook.model");

const createAudioBook = async (audioBookData) => {
  return await AudioBook.create(audioBookData);
};

const queryAudioBooks = async (filter, options) => {
  const query = {};

  query.published = true;
  
  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (key === "storyTitle" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }
  if (filter?.locationId) {
    query.locationId = filter?.locationId;
  }
  // Add populate options for 'audios' and nested 'languageId'
  options.populate = [
    {
      path: "audios",
      select: " -createdAt -updatedAt -__v", //-audioFile
      populate: {
        path: "languageId",
        select: "-createdAt -updatedAt -__v",
      },
    },
  ];
  const audioBooks = await AudioBook.paginate(query, options);

  return audioBooks;
};

const updateAudioBook = async (audioBookId, audioBookData) => {
  try {
    // Find the existing audiobook by ID
    const existingAudioBook = await AudioBook.findById(audioBookId);
    if (!existingAudioBook) {
      throw new Error("AudioBook not found");
    }

    // Merge the existing data with the new data
    const updatedData = {
      ...existingAudioBook.toObject(), // Convert Mongoose document to plain object
      ...audioBookData, // Override with new data
    };

    // If new cover photos are provided, replace the old ones
    if (audioBookData.coverPhotos) {
      updatedData.coverPhotos = audioBookData.coverPhotos;
    }

    // If new audio files are provided, append them to the existing list
    if (audioBookData.audios) {
      updatedData.audios = [
        ...existingAudioBook.audios,
        ...audioBookData.audios,
      ];
    }

    // Update the audiobook in the database
    const updatedAudioBook = await AudioBook.findByIdAndUpdate(
      audioBookId,
      updatedData,
      { new: true } // Return the updated document
    );

    return updatedAudioBook;
  } catch (error) {
    throw new Error(`Failed to update AudioBook: ${error.message}`);
  }
};

module.exports = {
  createAudioBook,
  queryAudioBooks,
  updateAudioBook,
};
