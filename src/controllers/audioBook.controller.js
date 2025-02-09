const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const audioBookService = require("../services/audioBook.service");
const audioFileService = require("../services/audioFile.service");
const AudioBook = require("../models/audioBook.model");
const mongoose = require("mongoose");
const pick = require("../utils/pick");
const Location = require("../models/location.model");

//[🚧][🧑‍💻][🧪] //  🚧 🧑‍💻✅  🧪🆗✔️
/*
const addNewAudioBook = catchAsync(async (req, res) => {
  // Step 1: Process uploaded cover photos
  const coverPhotos = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      coverPhotos.push("/uploads/coverPhotos/" + file.filename); // Adjust path as needed
    });
  }

  // Step 2: Create AudioFile documents
  const audioFilesData = req.body.audios; // Expect an array of audio files from the request body
  const audioFileIds = [];

  for (const audioFileData of audioFilesData) {
    // TODO : audioFileData.audioFile null kina check korte hobe ..

    if (!mongoose.Types.ObjectId.isValid(audioFileData.languageId)) {
      return res.status(400).json(
        response({
          message: "Invalid languageId. Please provide a valid LanguageId", // FIX Better : kon audio File er jonno languageId ta invalid .. sheta mention kora gele may be valo hoito ..
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
        })
      );
    }

    const audioFile = await audioFileService.createAudioFile(audioFileData); // Service function to create an AudioFile
    audioFileIds.push(audioFile._id);
  }

  // Step 3: Create the AudioBook document
  const audioBookData = {
    storyTitle: req.body.storyTitle,
    coverPhotos: coverPhotos,
    audios: audioFileIds, // Reference the created AudioFile IDs
    location: req.body.location, // Expect location data in the request body
  };

  const audioBook = await audioBookService.createAudioBook(audioBookData);

  res.status(httpStatus.CREATED).json(
    response({
      message: "AudioBook Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: audioBook,
    })
  );
});

*/

// TODO : Kono audio Book Delete korar time e .. location er count komano lagbe ..

//[🚧][🧑‍💻][🧪] //  🚧 🧑‍💻✅  🧪🆗✔️
const addNewAudioBook = catchAsync(async (req, res) => {
  // Step 1: Process uploaded cover photos
  const coverPhotos = [];
  if (req.files && req.files.coverPhotos) {
    req.files.coverPhotos.forEach((file) => {
      coverPhotos.push("/uploads/coverPhotos/" + file.filename); // Save the file path
    });
  }

  // Step 2: Process uploaded audio files
  const audioFilesData = [];
  if (req.files && req.files.audios) {
    req.files.audios.forEach((file) => {
      // Match the uploaded file with its corresponding languageId from the request body
      const matchingAudio = req.body.audios.find(
        (audio) => audio.audioFile === file.originalname
      );
      if (!matchingAudio) {
        throw new Error(
          `No matching languageId found for audio file: ${file.originalname}`
        );
      }
      audioFilesData.push({
        audioFile: "/uploads/audioFiles/" + file.filename, // Save the file path
        languageId: matchingAudio.languageId,
      });
    });
  }

  // Step 3: Validate and create AudioFile documents
  const audioFileIds = [];
  for (const audioFileData of audioFilesData) {
    if (!mongoose.Types.ObjectId.isValid(audioFileData.languageId)) {
      return res.status(400).json({
        message: `Invalid languageId for audio file: ${audioFileData.audioFile}`,
        status: "ERROR",
        statusCode: 400,
      });
    }
    const audioFile = await audioFileService.createAudioFile(audioFileData); // Create AudioFile document
    audioFileIds.push(audioFile._id);
  }

  // Step 4: Create the AudioBook document
  const audioBookData = {
    storyTitle: req.body.storyTitle,
    coverPhotos: coverPhotos,
    audios: audioFileIds, // Reference the created AudioFile IDs
    location: req.body.location, // Expect location data in the request body
  };

  const locationExist = await Location.findOne({
    name: req.body.location.name,
  });

  if (locationExist) {
    audioBookData.locationId = locationExist._id;
    await Location.findByIdAndUpdate(locationExist._id, {
      count: locationExist.count + 1,
    });
  } else {
    const location = await Location.create(req.body.location);
    audioBookData.locationId = location._id;
  }

  const audioBook = await audioBookService.createAudioBook(audioBookData);

  // Return success response
  res.status(201).json({
    message: "AudioBook Created",
    status: "OK",
    statusCode: 201,
    data: audioBook,
  });
});

//[🚧][🧑‍💻✅][🧪🆗]
const getAllAudioBook = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["storyTitle"]);
  const options = pick(req.query, []);
  const audioBook = await audioBookService.queryAudioBooks(filter, options);

  res.status(httpStatus.OK).json(
    response({
      message: "All AudioBooks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioBook,
    })
  );
});

//[🚧][ 🧑‍💻✅][🧪🆗]
const getAAudioBookById = catchAsync(async (req, res) => {
  let audioBook = await AudioBook.findById(req.params.audioBookId);

  if (!audioBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "audioBook not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "AudioBook",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioBook,
    })
  );
});

//[🚧][🧑‍💻][] // 🚧 🧑‍💻✅  🧪🆗

const updateAudioBookById = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Assuming the audiobook ID is passed as a URL parameter

  // Step 1: Process uploaded cover photos (if any)
  const coverPhotos = [];
  if (req.files && req.files.coverPhotos) {
    req.files.coverPhotos.forEach((file) => {
      coverPhotos.push("/uploads/coverPhotos/" + file.filename); // Save the file path
    });
  }

  // Step 2: Process uploaded audio files (if any)
  const audioFilesData = [];
  if (req.files && req.files.audios) {
    req.files.audios.forEach((file) => {
      // Match the uploaded file with its corresponding languageId from the request body
      const matchingAudio = req.body.audios.find(
        (audio) => audio.audioFile === file.originalname
      );
      if (!matchingAudio) {
        // TODO: API Error provide korte hobe ..
        throw new Error(
          `No matching languageId found for audio file: ${file.originalname}`
        );
      }
      audioFilesData.push({
        audioFile: "/uploads/audioFiles/" + file.filename, // Save the file path
        languageId: matchingAudio.languageId,
      });
    });
  }

  // Step 3: Validate and update AudioFile documents (if any new audio files are uploaded)
  const audioFileIds = [];
  for (const audioFileData of audioFilesData) {
    if (!mongoose.Types.ObjectId.isValid(audioFileData.languageId)) {
      return res.status(400).json({
        message: `Invalid languageId for audio file: ${audioFileData.audioFile}`,
        status: "ERROR",
        statusCode: 400,
      });
    }
    const audioFile = await audioFileService.createAudioFile(audioFileData); // Create new AudioFile document
    audioFileIds.push(audioFile._id);
  }

  // Step 4: Prepare data for updating the AudioBook
  const audioBookData = {
    storyTitle: req.body.storyTitle || undefined, // Update only if provided
    coverPhotos: coverPhotos.length > 0 ? coverPhotos : undefined, // Update only if new cover photos are uploaded
    audios: audioFileIds.length > 0 ? audioFileIds : undefined, // Update only if new audio files are uploaded
    location: req.body.location || undefined, // Update only if location is provided
  };

  // Step 5: Call the service to update the audiobook
  const updatedAudioBook = await audioBookService.updateAudioBook(
    audioBookId,
    audioBookData
  );

  // Return success response
  res.status(200).json({
    message: "AudioBook Updated",
    status: "OK",
    statusCode: 200,
    data: updatedAudioBook,
  });
});

//[🚧][🧑‍💻✅][🧪🆗] // 🚧 🧑‍💻✅  🧪🆗
const showAudioFilesForPreview = catchAsync(async (req, res) => {
  const audioFiles = await AudioBook.findById(req.params.audioBookId)
    .select("audios")
    .populate("audios")
    .lean(); // Optional: Use .lean() to return plain JavaScript objects instead of Mongoose documents

  console.log("show audioFile preview 🧪🧪", audioFiles);

  if (!audioFiles) {
    throw new Error("AudioBook not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Audio Files",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioFiles,
    })
  );
});

//[🚧][🧑‍💻][] // 🚧 🧑‍💻✅  🧪🆗
const editAudioBookPreview = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Extract the audiobook ID from the URL parameters

  // Step 1: Process uploaded audio files (if any)
  const audioFilesData = [];
  if (req.files && req.files.audios) {
    req.files.audios.forEach((file) => {
      // Match the uploaded file with its corresponding languageId from the request body
      const matchingAudio = req.body.audios.find(
        (audio) => audio.audioFile === file.originalname
      );
      if (!matchingAudio) {
        throw new Error(
          `No matching languageId found for audio file: ${file.originalname}`
        );
      }
      audioFilesData.push({
        audioFile: "/uploads/audioFiles/" + file.filename, // Save the file path
        languageId: matchingAudio.languageId,
      });
    });
  }

  // Step 2: Validate and create AudioFile documents (if any new audio files are uploaded)
  const audioFileIds = [];
  for (const audioFileData of audioFilesData) {
    if (!mongoose.Types.ObjectId.isValid(audioFileData.languageId)) {
      return res.status(400).json({
        message: `Invalid languageId for audio file: ${audioFileData.audioFile}`,
        status: "ERROR",
        statusCode: 400,
      });
    }
    const audioFile = await audioFileService.createAudioFile(audioFileData); // Create new AudioFile document
    audioFileIds.push(audioFile._id);
  }

  // Step 3: Prepare data for updating the audiobook's preview
  const updateData = {};
  if (audioFileIds.length > 0) {
    updateData.audios = audioFileIds; // Replace the existing audios with the new ones
  }

  // Step 4: Update the audiobook document
  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    { $set: updateData }, // Use $set to update only the specified fields
    { new: true } // Return the updated document
  ).populate("audios"); // Populate the 'audios' field to include the referenced AudioFile documents

  if (!updatedAudioBook) {
    throw new Error("AudioBook not found");
  }

  // Return success response
  res.status(200).json({
    message: "AudioBook Preview Updated Successfully",
    status: "OK",
    statusCode: 200,
    data: updatedAudioBook,
  });
});

module.exports = {
  addNewAudioBook,
  getAllAudioBook,
  getAAudioBookById,
  updateAudioBookById,
  showAudioFilesForPreview,
  editAudioBookPreview,
};
