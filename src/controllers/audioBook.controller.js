const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");

//[🚧][][] // 🧑‍💻✅  🧪🆗
const addNewAudioBook = catchAsync(async (req, res) => {
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
const getAllAudioBook = catchAsync(async (req, res) => {
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
const getAAudioBookById = catchAsync(async (req, res) => {
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
