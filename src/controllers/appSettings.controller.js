const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const AppSettings = require("../models/appSettings.model");
const appSettingsService = require("../services/appSettings.service");

//[🚧][🧑‍💻✅][🧪🆗✔️]  //
const getAppImages = catchAsync(async (req, res) => {
  const appImages = await AppSettings.find();

  res.status(httpStatus.CREATED).json(
    response({
      message: "All App Images",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: appImages,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗✔️]  //
const uploadBackgroundAndCharacterBtnPhoto = catchAsync(async (req, res) => {
  const { type } = req.body; // Extract the type from the request body
  const file = req.file; // Extract the uploaded file

  if (!file) {
    throw new Error("No file uploaded");
  }
  if (!type || !["backgroundPhoto", "characterBtnPhoto"].includes(type)) {
    throw new Error(
      "Invalid type. Type must be 'backgroundPhoto' or 'characterBtnPhoto'"
    );
  }

  // Construct the file path
  // const filePath = `/uploads/appSettings/${file.filename}`;

  // Call the service to handle the upload logic
  const updatedOrCreatedSetting = await appSettingsService.uploadImage(
    type,
    file
  );

  // Return success response
  res.status(200).json({
    message: "Image Uploaded Successfully",
    status: "OK",
    statusCode: 200,
    data: updatedOrCreatedSetting,
  });
});

module.exports = {
  getAppImages,
  uploadBackgroundAndCharacterBtnPhoto,
};
