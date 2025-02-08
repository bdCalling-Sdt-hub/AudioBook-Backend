const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const validate = require("../../middlewares/validate");
const UPLOADS_FOLDER_LANGUAGE = "./public/uploads/audioFiles"; // FIX  : change variable name ..use accurate variable name ..
const audioBookValidation = require("../../validations/audioBook.validation");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const uploadLanguage = userFileUploadMiddleware(UPLOADS_FOLDER_LANGUAGE);

router.route("/:id").get(auth("common"), audioBookController.getAAudioBookById);

router.route("/all").get(auth("common"), audioBookController.getAllAudioBook);

router.route("/").post(
  [uploadLanguage.array("coverPhotos")],
  auth("commonAdmin"),
  validate(audioBookValidation.addNewAudioBook),
  // TODO :  HeicToPngMiddleware add korte hobe ..
  audioBookController.addNewAudioBook
);

router
  .route("/:audioBookId")
  .put(
    auth("commonAdmin"),
    [uploadLanguage.array("coverPhotos")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_LANGUAGE),
    audioBookController.updateAudioBookById
  );
router
  .route("preview/:audioBookId")
  .patch(auth("commonAdmin"), audioBookController.editPreviewById);

module.exports = router;
