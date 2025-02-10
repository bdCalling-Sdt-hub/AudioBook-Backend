const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const Location = require("../models/location.model");

//[🚧][🧑‍💻][] // 🧑‍💻✅  🧪🆗
const getAllLocation = catchAsync(async (req, res) => {
  const result = await Location.find();
  res.status(httpStatus.OK).json(
    response({
      message: "All language",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  getAllLocation,
};
