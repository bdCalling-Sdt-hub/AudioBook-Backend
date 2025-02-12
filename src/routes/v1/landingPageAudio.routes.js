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
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").get(auth("common"), landingPageAudioController.getAllAudio);
router
  .route("/:audioId")
  .get(auth("common"), landingPageAudioController.getAAudioById); // playAAudioById
router.route("/").post(
  // auth("commonAdmin"),
  [upload.single("audioFile")], // uploadLandingPageAudio
  validate(languagePageAudioValidation.addNewLandingPageAudio),
  landingPageAudioController.addNewAudio
);

router.route("/:landingPageAudioId").delete(
  // auth("commonAdmin"),
  landingPageAudioController.deleteLandingPageAudio
);

// [uploadLandingPageAudio.fields([{ name: "audioFile", maxCount: 1 }])],

// FIX : this should be audio file not image file
// FIX : audio file er jonno etar dorkar nai ..
// validate(languagePageAudioValidation.addNewLandingPageAudio),
// FIX :  after submit validation is not working properly \"audioFile\" is required, \"languageId\" is required

router.route("/:audioId").put(
  auth("commonAdmin"),
  [uploadLandingPageAudio.single("audioFile")], // TODO: validation add kora lagbe ..
  landingPageAudioController.updateAudioById
);

module.exports = router;
