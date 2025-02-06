const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");

const getAppImages = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const uploadBackgroundAndCharacterBtnPhoto = catchAsync(async (req, res) => {
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
  getAppImages,
  uploadBackgroundAndCharacterBtnPhoto,
};
