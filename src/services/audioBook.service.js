const AudioBook = require("../models/audioBook.model");

const createAudioBook = async (audioBookData) => {
  return await AudioBook.create(audioBookData);
};

const queryAudioBookForAdmin = async (filter, options) => {
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

  // 🟢🟢🟢 ekhane modify kora lagbe ..  Admin er jonno  query.audios = { $ne: [] }; ei line
  // bad diye ekta api banay dite hobe ..  🧪 Done

  // Add condition to check that the 'audios' array is not empty
  //query.audios = { $ne: [] };  // Only return audio books where the 'audios' array is not empty

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

const queryAudioBooks = async (filter, options) => {
  const query = {};

  query.published = true;

  // 🟢🟢🟢 ekhane modify kora lagbe ..  Admin er jonno  query.audios = { $ne: [] }; ei line
  // bad diye ekta api banay dite hobe ..

  // Add condition to check that the 'audios' array is not empty
  query.audios = { $ne: [] }; // Only return audio books where the 'audios' array is not empty

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (key === "storyTitle" && filter[key] !== "") {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (key === "isPreview" && filter[key] !== undefined) {
      console.log("isPreview 🫡🫡🫡", filter[key]);
      // Handle isPreview filtering
      //const isPreviewValue = filter[key]; // Convert string to boolean // === "true"
      query.audios = {
        $elemMatch: { isPreview: filter[key] }, // Match audiobooks with at least one audio file matching isPreview
      };
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }
  if (filter?.locationId) {
    query.locationId = filter?.locationId;
  }

  // // Ensure the 'audios' array is not empty unless isPreview is explicitly set
  // if (!query.audios.$elemMatch) {
  //   query.audios = { $ne: [] }; // Only return audiobooks where the 'audios' array is not empty
  // }

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
  queryAudioBookForAdmin,
  updateAudioBook,
};
