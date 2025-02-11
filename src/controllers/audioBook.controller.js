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
const { uploadFileToSpace } = require("../middlewares/digitalOcean");

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
  const audioBookId = req.params.audioBookId;

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
    req.body.audioFile = await uploadFileToSpace(req.file, "audioBooks"); // images // TODO: eta ki folder Name ? rakib vai ke ask korte hobe

    // req.body.audioFile = "/uploads/audioFiles/" + req.file.filename;
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
  let audioBook = await AudioBook.findById(req.params.audioBookId).populate({
    path: "audios", // Populate the 'audios' field
    select: "-audioFile -createdAt -updatedAt -__v", // Exclude the 'audioFile' field
    populate: {
      path: "languageId", // Populate the 'languageId' field within 'audios'
      select: "-createdAt -updatedAt -__v", // Include only specific fields from the Language model
      // name flagImage
    },
  });

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
    req.files.coverPhotos.forEach(async (file) => {
      // coverPhotos.push("/uploads/coverPhotos/" + file.filename); // Save the file path

      const coverPhotoUrl = await uploadFileToSpace(file, "audioBooks");

      await coverPhotos.push(coverPhotoUrl);
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

  // Step 4: Handle location updates
  if (req.body.locationId) {
    const locationExist = await Location.findById(req.body.locationId);

    if (locationExist) {
      // Check if the locationId is being changed
      if (audioBook.locationId?.toString() !== req.body.locationId) {
        audioBookData.locationId = locationExist._id;

        // Increment the count for the new location
        await Location.findByIdAndUpdate(locationExist._id, {
          $inc: { count: 1 }, // Increment the count by 1
        });

        // Decrement the count for the previous location (if it exists)
        if (audioBook.locationId) {
          await Location.findByIdAndUpdate(audioBook.locationId, {
            $inc: { count: -1 }, // Decrement the count by 1
          });
        }
      }
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
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
// Fix: Must korte hobe ImageUpload Update korte hobe .. digitalocean e
const editAudioBookPreview = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Extract the audiobook ID from the URL parameters

  // Step 0: Validate the existence of the AudioBook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
  }

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
  const updateData = {
    audios: audioFileIDs, // Update the `audios` field with the fetched audio file IDs
  };

  // Step 3: Update the audiobook document in the database
  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    { $set: updateData }, // Use `$set` to update only the specified fields
    { new: true } // Return the updated document
  ).populate("audios"); // Populate the `audios` field to include referenced AudioFile documents

  if (!updatedAudioBook) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update AudioBook"
    );
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
