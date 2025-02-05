const express = require("express");
const router = express.Router();

router.route("/").get(auth("commonAdmin"), languageController.getAllLanguage);
router.route("/").post(auth("commonAdmin"), languageController.addNewLanguage);

module.exports = router;
