const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const validate = require("../../middlewares/validate");

const UPLOADS_FOLDER_AUDIO_BOOKS = "./public/uploads/audioBooks";

const audioBookValidation = require("../../validations/audioBook.validation");

const uploadAudioBooks = userFileUploadMiddleware(UPLOADS_FOLDER_AUDIO_BOOKS);

// TODO : Search By Name  er case e idea lagbe Shahinur vai er theke
router.route("/").get(auth("common"), audioBookController.getAllAudioBook);
router.route("/").post(
  [
    uploadAudioBooks.fields([
      { name: "coverPhotos", maxCount: 5 }, // Allow up to 5 cover photos
      { name: "audios", maxCount: 10 }, // Allow up to 10 audio files
    ]),
  ],
  auth("commonAdmin"),
  validate(audioBookValidation.addNewAudioBook),
  audioBookController.addNewAudioBook
);
// router
// .route("/")
// .post(
//   [uploadCoverPhotos.array("coverPhotos")],
//   auth("commonAdmin"),
//   validate(audioBookValidation.addNewAudioBook),
//   audioBookController.addNewAudioBook
// );

router
  .route("/:audioBookId")
  .patch(auth("commonAdmin"), audioBookController.updateAudioBookById);
router
  .route("preview/:audioBookId")
  .patch(auth("commonAdmin"), audioBookController.editPreviewById);
router
  .route("/:audioBookId")
  .get(auth("common"), audioBookController.getAAudioBookById);

module.exports = router;
