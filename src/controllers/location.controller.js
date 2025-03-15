const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const Location = require("../models/location.model");
const ApiError = require("../utils/ApiError");
const { deleteFileFromSpace } = require("../middlewares/digitalOcean");

//[🚧][🧑‍💻][] // 🧑‍💻✅  🧪🆗
const getAllLocation = catchAsync(async (req, res) => {
  const result = await Location.find({ count: { $gt: 0 } });
  res.status(httpStatus.OK).json(
    response({
      message: "All location",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getAllLocationForAdmin = catchAsync(async (req, res) => {
  const result = await Location.find();
  res.status(httpStatus.OK).json(
    response({
      message: "All location",
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

  try {
 
  // Delete the location
  await Location.deleteOne({ _id: req.params.locationId });

  } catch (error) {
    // Error handling for file deletion or DB deletion failure
    console.error("Error during file deletion:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete location");
  }

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
  // Test 
  const { name } = req.body;

  // Check if a location with the same name already exists
  const existingLocation = await Location.findOne({ name });

  if (existingLocation) {
    throw new ApiError(httpStatus.CONFLICT, "Location with this name already exists");
  }

  req.body.count = 0;
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
  getAllLocationForAdmin
};
