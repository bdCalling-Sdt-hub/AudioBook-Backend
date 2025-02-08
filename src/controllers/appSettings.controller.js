const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const AppSettings = require("../models/appSettings.model");

//[🚧][🧑‍💻][🧪]  // ✅ 🆗 ✔️
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

//[🚧][🧑‍💻✅][🧪]  // ✅ 🆗 ✔️
const uploadBackgroundAndCharacterBtnPhoto = catchAsync(async (req, res) => {
  // TODO  : alreay exist korle  ki korte hobe ?
  if (req.files.backgroundPhoto) {
    req.body.backgroundPhoto =
      "/uploads/appSettings/" + req.files.backgroundPhoto[0].filename;
  }

  if (req.files.characterBtnPhoto) {
    req.body.characterBtnPhoto =
      "/uploads/appSettings/" + req.files.characterBtnPhoto[0].filename;
  }

  const backgroundAndCharacterBtnPhoto = await AppSettings.create(req.body);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Background And CharacterBtnPhoto Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: backgroundAndCharacterBtnPhoto,
    })
  );
});

module.exports = {
  getAppImages,
  uploadBackgroundAndCharacterBtnPhoto,
};
