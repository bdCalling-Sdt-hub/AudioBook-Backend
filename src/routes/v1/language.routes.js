const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const languageController = require("../../controllers/language.controller");

router.route("/").get(auth("commonAdmin"), languageController.getAllLanguage);
router.route("/").post(auth("commonAdmin"), languageController.addNewLanguage);

module.exports = router;
