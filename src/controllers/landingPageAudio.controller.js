const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const LandingPageAudios = require("../models/landingPageAudio.model");
const LandingPageAUdioService = require("../services/landingPageAudio.service");

const addNewAudio = catchAsync(async (req, res) => {
  console.log("print req.body from addNewAudio🚧", req.body);
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
