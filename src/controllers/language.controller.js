const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const languageService = require("../services/language.service");
const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");
const ApiError = require("../utils/ApiError");
const { Language } = require("../models");

//[🚧][🧑‍💻✅][🧪🆗]
const addNewLanguage = catchAsync(async (req, res) => {
  if (req.file) {
    // req.body.flagImage = "/uploads/languages/" + req.file.filename;
    req.body.flagImage = await uploadFileToSpace(req.file, "languages"); // images // TODO: eta ki folder Name ? rakib vai ke ask korte hobe
  }

  const language = await languageService.addNewLanguage(req.body);
  // console.log(req.file);

  res.status(httpStatus.CREATED).json(
    response({
      message: "language Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: language,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]
const getAllLanguage = catchAsync(async (req, res) => {
  const result = await languageService.getAllLanguage();
  res.status(httpStatus.CREATED).json(
    response({
      message: "All language",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// TODO:🔴 not tested api endpoint not created ..
const deleteLanguage = catchAsync(async (req, res) => {
  const language = await Language.findById(req.params.languageId);
  if (!language) {
    throw new ApiError(httpStatus.NOT_FOUND, "Language not found");
  }

  try {
    // Delete image from DigitalOcean Space
    await deleteFileFromSpace(language.flagImage);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete image from DigitalOcean Space"
    );
  }
  await language.deleteOne();

  res.status(httpStatus.OK).json(
    response({
      message: "Language Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: language,
    })
  );
});

module.exports = {
  addNewLanguage,
  getAllLanguage,
  deleteLanguage,
};
