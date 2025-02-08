const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const audioBookService = require("../services/audioBook.service");
const audioFileService = require("../services/audioFile.service");
const AudioBook = require("../models/audioBook.model");
const mongoose = require("mongoose");
const pick = require("../utils/pick");

//[🚧][🧑‍💻][🧪] //  🚧 🧑‍💻✅  🧪🆗✔️
const addNewAudioBook = catchAsync(async (req, res) => {
  // Step 1: Process uploaded cover photos
  const coverPhotos = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      coverPhotos.push("/uploads/audiobooks/" + file.filename); // Adjust path as needed
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

//[🚧][🧑‍💻][🧪] // 🚧 🧑‍💻✅  🧪🆗
const getAllAudioBook = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["storyTitle"]);
  const options = pick(req.query, []);

  const result = await audioBookService.queryAudioBooks(filter, options);
  // const audioBooks = await AudioBook.find();

  res.status(httpStatus.CREATED).json(
    response({
      message: "All AudioBooks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗] // 🚧 🧑‍💻✅  🧪🆗
const getAAudioBookById = catchAsync(async (req, res) => {
  const audioBook = await AudioBook.findById(req.params.id);
  if (!audioBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
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

//[][][] // 🚧 🧑‍💻✅  🧪🆗
const updateAudioBookById = catchAsync(async (req, res) => {
  
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

//[][][] // 🚧 🧑‍💻✅  🧪🆗
const editPreviewById = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

module.exports = {
  addNewAudioBook,
  getAllAudioBook,
  getAAudioBookById,
  updateAudioBookById,
  editPreviewById,
};
