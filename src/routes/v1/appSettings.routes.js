const express = require("express");
const router = express.Router();
const appSettingsController = require("../../controllers/appSettings.controller");
const auth = require("../../middlewares/auth");

const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_APP_SETTINGS = "./public/uploads/appSettings";

const uploadAppSettings = userFileUploadMiddleware(UPLOADS_FOLDER_APP_SETTINGS);

router.route("/").get(auth("common"), appSettingsController.getAppImages);

router.route("/").post(
  auth("commonAdmin"),
  [
    uploadAppSettings.fields([
      { name: "backgroundPhoto", maxCount: 1 },
      { name: "characterBtnPhoto", maxCount: 1 },
    ]),
  ],

  convertHeicToPngMiddleware(UPLOADS_FOLDER_APP_SETTINGS),

  appSettingsController.uploadBackgroundAndCharacterBtnPhoto
);

// TODO : may be duita alada image upload korar jonno duita alada route lagbe ..

module.exports = router;
