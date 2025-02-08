const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const landingPageAudioController = require("../../controllers/landingPageAudio.controller");
const validate = require("../../middlewares/validate");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_LANDING_PAGE_AUDIO = "./public/uploads/landingPageAudio";
const uploadLandingPageAudio = userFileUploadMiddleware(
  UPLOADS_FOLDER_LANDING_PAGE_AUDIO
);
const languagePageAudioValidation = require("../../validations/landingPageAudio.validation");

router.route("/").get(auth("common"), landingPageAudioController.getAllAudio);
router
  .route("/:audioId")
  .get(auth("common"), landingPageAudioController.getAAudioById); // playAAudioById
router
  .route("/")
  .post(
    auth("commonAdmin"),
    [uploadLandingPageAudio.single("audioFile")],
    validate(languagePageAudioValidation.addNewLandingPageAudio),
    landingPageAudioController.addNewAudio
  );

// [uploadLandingPageAudio.fields([{ name: "audioFile", maxCount: 1 }])],

// FIX : this should be audio file not image file
// FIX : audio file er jonno etar dorkar nai ..
// validate(languagePageAudioValidation.addNewLandingPageAudio),
// FIX :  after submit validation is not working properly \"audioFile\" is required, \"languageId\" is required

router
  .route("/:audioId")
  .patch(auth("commonAdmin"), landingPageAudioController.updateAudioById);

module.exports = router;
