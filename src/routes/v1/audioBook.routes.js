const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
const multer = require("multer");
const validate = require("../../middlewares/validate");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const audioBookValidation = require("../../validations/audioBook.validation");

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
router
  .route("/audios/:audioBookId")
  .post(
    [
      upload.single("audioFile"),
      validate(audioBookValidation.addAudioWithLanguageIdForAudioBook),
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
  validate(audioBookValidation.updateAudioBook), // TODO : put er jonno new Validation lagbe ..
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

router.route("/:audioBookId").delete(
  // auth("commonAdmin"),
  audioBookController.deleteAudioBookById
);

module.exports = router;
