const express = require("express");
const router = express.Router();
const appSettingsController = require("../../controllers/appSettings.controller");
const auth = require("../../middlewares/auth");

const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_APP_SETTINGS = "./public/uploads/appSettings";

const uploadAppSettings = userFileUploadMiddleware(UPLOADS_FOLDER_APP_SETTINGS);

router.route("/").get(appSettingsController.getAppImages);

router
  .route("/")
  .post(
    auth("commonAdmin"),
    [uploadAppSettings.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_APP_SETTINGS),
    appSettingsController.uploadBackgroundAndCharacterBtnPhoto
  );

module.exports = router;
