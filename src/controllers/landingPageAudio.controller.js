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
  // Ensure a file was uploaded
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

  const landingPageAudio = LandingPageAUdioService.addNewAudio(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Audio Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: landingPageAudio,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]  // it returns without audioFile
const getAllAudio = catchAsync(async (req, res) => {
  const audios = await LandingPageAudios.find()
    .select("-audioFile")
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
    req.body.audioFile = "/uploads/landingPageAudio/" + req.file.filename;
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

    // TODO : Test  Delete hocche kina check korte hobe ..
    // Delete image from DigitalOcean Space
    const result = await deleteFileFromSpace(landingPageAudio.audioFile);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete image from DigitalOcean Space"
      );
    }
    await landingPageAudio.deleteOne();

    res.status(httpStatus.OK).json(
      response({
        message: "Landing Page Audio Deleted",
        status: "OK",
        statusCode: httpStatus.OK,
        data: null,
      })
    );
  }
});

module.exports = {
  addNewAudio,
  getAllAudio,
  getAAudioById,
  updateAudioById,
  deleteLandingPageAudio,
};
