const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const LandingPageAudios = require("../models/landingPageAudio.model");
const LandingPageAUdioService = require("../services/landingPageAudio.service");
const mongoose = require("mongoose");
const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");
const ApiError = require("../utils/ApiError");

//[🚧][🧑‍💻✅][🧪🆗✔️]  //
const addNewAudio = catchAsync(async (req, res) => {
  
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
    req.body.audioFile = await uploadFileToSpace(req.file, "landingPageAudio");
  }

  // Validate that languageId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.body.languageId)) {
    return res.status(400).json(
      response({
        message: "Invalid languageId. Please provide a valid ObjectId.",
        status: "ERROR",
        
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  const landingPageAudio = await LandingPageAUdioService.addNewAudio(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Audio Created",
      status: "OK",
      statusCode: httpStatus.OK,
      data: landingPageAudio
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]  // it returns without audioFile
const getAllAudio = catchAsync(async (req, res) => {
  const audios = await LandingPageAudios.find()
    .select("-updatedAt") // its not working
    .populate("languageId");

  res.status(httpStatus.OK).json(
    response({
      message: "All Audio",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audios,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]  // 🧑‍💻✅  🧪🆗
const getAAudioById = catchAsync(async (req, res) => {
  const audio = await LandingPageAudios.findById(req.params.audioId);
  res.status(httpStatus.OK).json(
    response({
      message: "Audio",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audio,
    })
  );
});

// TODO :FIX update korte hobe .. othoba abar test korte hobe
//[🚧][🧑‍💻][]  // 🧑‍💻✅  🧪🆗
const updateAudioById = catchAsync(async (req, res) => {
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
    req.body.audioFile = await uploadFileToSpace(req.file, "landingPageAudio");
  }

  // FIX :   .. eta test korte hobe .. kaj kore kina ..
  // Validate that languageId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.body.languageId)) {
    return res.status(400).json(
      response({
        message: "Invalid languageId. Please provide a valid ObjectId.",
        status: "ERROR",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  const audio = await LandingPageAudios.findByIdAndUpdate(
    req.params.audioId,
    req.body,
    { new: true }
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Landing Page Audio Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audio,
    })
  );
});


const deleteLandingPageAudio = catchAsync(async (req, res) => {
  const audioFileId = req.params.landingPageAudioId;
  if (audioFileId) {
    const landingPageAudio = await LandingPageAudios.findById(audioFileId);

    if (!landingPageAudio) {
      throw new ApiError(httpStatus.NOT_FOUND, "Audio File not found");
    }

    try {
      // Delete file from DigitalOcean Space
      await deleteFileFromSpace(landingPageAudio?.audioFile);

      // Delete the audio record from the database
      await landingPageAudio.deleteOne();

      res.status(httpStatus.OK).json(
        response({
          message: "Landing Page Audio Deleted",
          status: "OK",
          statusCode: httpStatus.OK,
          data: landingPageAudio, // Optionally, return null since the file is deleted
        })
      );
    } catch (error) {
      // Error handling for file deletion or DB deletion failure
      console.error("Error during file deletion:", error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete audio file");
    }
  } else {
    // Handling case when `audioFileId` is not provided
    throw new ApiError(httpStatus.BAD_REQUEST, "Landing Page Audio ID is required");
  }
});


module.exports = {
  addNewAudio,
  getAllAudio,
  getAAudioById,
  updateAudioById,
  deleteLandingPageAudio,
};
