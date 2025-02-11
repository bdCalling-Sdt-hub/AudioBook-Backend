const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
// const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const validate = require("../../middlewares/validate");
// const UPLOADS_FOLDER_AUDIO_BOOKS = "./public/uploads/audioBooks";
const audioBookValidation = require("../../validations/audioBook.validation");
// const uploadAudioBooks = userFileUploadMiddleware(UPLOADS_FOLDER_AUDIO_BOOKS);
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    upload.single("audioFile"),
    // validate(characterValidation.addNewCharacter),
  ],
  auth("commonAdmin"),
  audioBookController.addAudioWithLanguageIdForAudioBook
);

router
  .route("/audioFile/:audioFileId")
  .delete(auth("commonAdmin"), audioBookController.deleteAudioFile);

router.route("/:audioBookId").put(
  [
    upload.fields([
      { name: "coverPhotos", maxCount: 15 }, // Allow up to 5 cover photos
    ]),
  ],
  auth("commonAdmin"),
  // validate(audioBookValidation.addNewAudioBook), // TODO : put er jonno new Validation lagbe ..
  audioBookController.updateAudioBookById
);

router
  .route("/preview/:audioBookId")
  .get(auth("commonAdmin"), audioBookController.showAudioFilesForPreview);

// TODO : Must Fix .. etar controller update korte hobe .. Digital Ocean e upload korar jonno
router.route("/preview/:audioBookId").put(
  [
    upload.fields([
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
