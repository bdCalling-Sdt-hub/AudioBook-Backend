const express = require("express");
const router = express.Router();

const appSettingsController = require("../../controllers/appSettings.controller");

router
  .route("/getAppImages")
  .get(auth("common"), appSettingsController.getAppImages); // Search By Name

router
  .route("/")
  .post(
    auth("commonAdmin"),
    appSettingsController.uploadBackgroundAndCharacterBtnPhoto
  );

module.exports = router;
