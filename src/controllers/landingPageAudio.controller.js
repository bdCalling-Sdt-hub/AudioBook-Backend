const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const LandingPageAudios = require("../models/landingPageAudio.model");
const LandingPageAUdioService = require("../services/landingPageAudio.service");
const mongoose = require("mongoose");

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

//[🚧][🧑‍💻✅][🧪🆗]  //
const getAllAudio = catchAsync(async (req, res) => {
  const audios = await LandingPageAudios.find();

  res.status(httpStatus.OK).json(
    response({
      message: "All Audio",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audios,
    })
  );
});

//[🚧][][]  // 🧑‍💻✅  🧪🆗
const getAAudioById = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

//[🚧][][]  // 🧑‍💻✅  🧪🆗
const updateAudioById = catchAsync(async (req, res) => {
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
  addNewAudio,
  getAllAudio,
  getAAudioById,
  updateAudioById,
};
