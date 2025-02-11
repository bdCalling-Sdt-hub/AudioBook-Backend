const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const validate = require("../../middlewares/validate");

const UPLOADS_FOLDER_AUDIO_BOOKS = "./public/uploads/audioBooks";

const audioBookValidation = require("../../validations/audioBook.validation");

const uploadAudioBooks = userFileUploadMiddleware(UPLOADS_FOLDER_AUDIO_BOOKS);

// 🧪
router.route("/").get(audioBookController.getAllAudioBook);
// auth("common"),

// 🧪
// create new audioBook after click on add new audioBook button
router.route("/create").get(
  auth("commonAdmin"),
  // validate(characterValidation.addNewCharacter),
  audioBookController.createAudioBook
);
// 🧪
router.route("/audios/:audioBookId").post(
  [
    uploadAudioBooks.single("audioFile"),
    // validate(characterValidation.addNewCharacter),
  ],
  auth("commonAdmin"),
  audioBookController.addAudioWithLanguageIdForAudioBook
);

router.route("/:audioBookId").put(
  [
    uploadAudioBooks.fields([
      { name: "coverPhotos", maxCount: 5 }, // Allow up to 5 cover photos
    ]),
  ],
  auth("commonAdmin"),
  // validate(audioBookValidation.addNewAudioBook), // TODO : put er jonno new Validation lagbe ..
  audioBookController.updateAudioBookById
);

router
  .route("/preview/:audioBookId")
  .get(auth("commonAdmin"), audioBookController.showAudioFilesForPreview);

router.route("/preview/:audioBookId").put(
  [
    uploadAudioBooks.fields([
      { name: "audios", maxCount: 10 }, // Allow up to 10 audio files
    ]),
  ],
  auth("commonAdmin"),
  audioBookController.editAudioBookPreview
);
router
  .route("/:audioBookId")
  .get(auth("common"), audioBookController.getAAudioBookById);

module.exports = router;
