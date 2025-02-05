const express = require("express");
const router = express.Router();

router
  .route("/getAppImages")
  .get(auth("common"), languageController.getAppImages); // Search By Name
router
  .route("/")
  .post(
    auth("commonAdmin"),
    languageController.uploadBackgroundAndCharacterBtnPhoto
  );

module.exports = router;
