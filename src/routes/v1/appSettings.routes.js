const express = require("express");
const router = express.Router();
const appSettingsController = require("../../controllers/appSettings.controller");
const auth = require("../../middlewares/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").get(appSettingsController.getAppImages);

router.route("/").post(
  auth("commonAdmin"),
  [upload.single("image")],

  appSettingsController.uploadBackgroundAndCharacterBtnPhoto
);

module.exports = router;
