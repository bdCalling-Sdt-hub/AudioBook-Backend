const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const languageService = require("../services/language.service");

//[🚧][🧑‍💻✅][🧪🆗]
const addNewLanguage = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.flagImage = "/uploads/languages/" + req.file.filename;
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

module.exports = {
  addNewLanguage,
  getAllLanguage,
};
