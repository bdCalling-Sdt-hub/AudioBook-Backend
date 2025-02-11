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
const AudioFile = require("../models/audioFile.model");

// TODO : Kono audio Book Delete korar time e .. location er count komano lagbe ..

//[🚧][🧑‍💻✅][🧪🆗✔️] //
const createAudioBook = catchAsync(async (req, res) => {
  const newCharacter = await AudioBook.create({ published: false });

  res.status(httpStatus.CREATED).json(
    response({
      message: "AudioBook Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: newCharacter,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗✔️] //
const addAudioWithLanguageIdForAudioBook = catchAsync(async (req, res) => {
  console.log("hit to controller 🧪🧪🧪🧪🧪");
  const audioBookId = req.params.audioBookId; // audioFile er attachedTo field e characterId save korbo

  if (audioBookId) {
    req.body.attachedTo = audioBookId;
  }

  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "No audio file uploaded",
        status: "ERROR",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  if (req.file) {
    req.body.audioFile = "/uploads/audioFiles/" + req.file.filename;
  }

  // FIX: Validate that languageId is a valid .. but this give me error ..tai comment kore rakhsi .. but eta fix kora lagbe ..
  // if (!mongoose.Types.ObjectId.isValid(req.body.languageId)) {
  //   return res.status(400).json(
  //     response({
  //       message: "Invalid languageId. Please provide a valid ObjectId.",
  //       status: "ERROR",
  //       statusCode: httpStatus.BAD_REQUEST,
  //     })
  //   );
  // }

  const audioFile = AudioFile.create(req.body);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Audio Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: audioFile,
    })
  );
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

//[🚧][🧑‍💻✅][🧪🆗] //
// TODO : location er count update kora .. eta location name er upor base kore hocche
// TODO May be location id er upor base kore kora lagbe ..

const updateAudioBookById = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Assuming the audiobook ID is passed as a URL parameter

  // Step 0: Fetch the existing audiobook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
  }

  // Step 1: Process uploaded cover photos (if any)
  const coverPhotos = [];
  if (req.files && req.files.coverPhotos) {
    req.files.coverPhotos.forEach((file) => {
      coverPhotos.push("/uploads/coverPhotos/" + file.filename); // Save the file path
    });
  }

  // Step 0 : search for audioFiles from audioFile Table and get  audioFileId which are
  // related to this character Id

  const audioFileIds = await AudioFile.find(
    {
      attachedTo: req.params.audioBookId,
    },
    { _id: 1 }
  );

  // Step 2: Process uploaded audio files
  const audioFileIDs = [];

  for (const audioFileId of audioFileIds) {
    audioFileIDs.push(audioFileId._id);
  }

  const audioBookData = {
    storyTitle: req.body.storyTitle,
    coverPhotos: coverPhotos,
    audios: audioFileIDs, // Reference the created AudioFile IDs
    published: true,
  };

  if (req.body.locationId) {
    const locationExist = await Location.findById(req?.body?.locationId);

    if (locationExist) {
      audioBookData.locationId = locationExist._id;
      await Location.findByIdAndUpdate(locationExist._id, {
        count: locationExist.count + 1,
      });
    }
  }

  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    audioBookData,
    { new: true }
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
  createAudioBook,
  addAudioWithLanguageIdForAudioBook,
  getAllAudioBook,
  getAAudioBookById,
  updateAudioBookById,
  showAudioFilesForPreview,
  editAudioBookPreview,
};
