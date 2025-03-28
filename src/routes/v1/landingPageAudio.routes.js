const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const landingPageAudioController = require("../../controllers/landingPageAudio.controller");
const validate = require("../../middlewares/validate");

const languagePageAudioValidation = require("../../validations/landingPageAudio.validation");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,
    limits: { fileSize: 4000 * 1024 * 1024 }
});

router.route("/").get(
  // auth("common"),
  landingPageAudioController.getAllAudio
);
router
  .route("/:audioId")
  .get(auth("common"), landingPageAudioController.getAAudioById); // playAAudioById

router.route("/").post(
  auth("commonAdmin"),
  [upload.single("audioFile")], // uploadLandingPageAudio
  validate(languagePageAudioValidation.addNewLandingPageAudio),
  landingPageAudioController.addNewAudio
);

router
  .route("/:landingPageAudioId")
  .delete(
    auth("commonAdmin"),
    landingPageAudioController.deleteLandingPageAudio
  );

// [uploadLandingPageAudio.fields([{ name: "audioFile", maxCount: 1 }])],

// FIX : this should be audio file not image file
// FIX : audio file er jonno etar dorkar nai ..
// validate(languagePageAudioValidation.addNewLandingPageAudio),
// FIX :  after submit validation is not working properly \"audioFile\" is required, \"languageId\" is required

// TODO : FIX  etar kaj kora hoy nai
router.route("/:audioId").put(
  auth("commonAdmin"),
  [upload.single("audioFile")], // TODO: validation add kora lagbe ..
  landingPageAudioController.updateAudioById
);

module.exports = router;
