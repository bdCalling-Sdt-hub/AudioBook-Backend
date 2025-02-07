const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const validate = require("../../middlewares/validate");
const UPLOADS_FOLDER_LANGUAGE = "./public/uploads/audioFiles";
const audioBookValidation = require("../../validations/audioBook.validation");

const uploadLanguage = userFileUploadMiddleware(UPLOADS_FOLDER_LANGUAGE);

// TODO : Search By Name  er case e idea lagbe Shahinur vai er theke
router.route("/").get(auth("common"), audioBookController.getAllAudioBook);
router
  .route("/")
  .post(
    [uploadLanguage.array("coverPhotos")],
    auth("commonAdmin"),
    validate(audioBookValidation.addNewAudioBook),
    audioBookController.addNewAudioBook
  );
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
