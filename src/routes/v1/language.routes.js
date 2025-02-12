const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const languageController = require("../../controllers/language.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").get(auth("commonAdmin"), languageController.getAllLanguage);

// 🧪
router.route("/").post(
  auth("commonAdmin"),
  // [uploadLanguage.single("flagImage")],
  [upload.single("flagImage")],
  // validate(languageValidation.addNewLanguage),
  languageController.addNewLanguage
);

// TODO : getLanguageById And updateLanguageById

router.route("/:languageId").delete(
  // auth("commonAdmin"),
  languageController.deleteLanguage
);

module.exports = router;
