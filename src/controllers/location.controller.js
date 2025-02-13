const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const Location = require("../models/location.model");
const ApiError = require("../utils/ApiError");

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

const deleteLocation = catchAsync(async (req, res) => {
  const location = Location.findById(req.params.locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  }

  // await location.deleteOne();

  // Delete the location
  await Location.deleteOne({ _id: req.params.locationId });

  res.status(httpStatus.OK).json(
    response({
      message: "Location Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

const createLocation = catchAsync(async (req, res) => {
  const location = await Location.create(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Location Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: location,
    })
  );
});

const updateLocation = catchAsync(async (req, res) => {
  const location = await Location.findById(req.params.locationId);

  if (!location) {
    throw new Error("Location not found");
  }

  const updatedLocation = await Location.findByIdAndUpdate(
    req.params.locationId,
    req.body,
    { new: true }
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Location Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updatedLocation,
    })
  );
});

module.exports = {
  createLocation,
  deleteLocation,
  getAllLocation,
  updateLocation,
};
