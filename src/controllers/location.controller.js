const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const Location = require("../models/location.model");

// TODO : Must Fix : emon kono location  front-end e send kora jabe na .. jeta
//[🚧][🧑‍💻][] // 🧑‍💻✅  🧪🆗
const getAllLocation = catchAsync(async (req, res) => {
  const result = await Location.find({ count: { $gt: 0 } });
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
