const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const landingPageAudioController = require("../../controllers/landingPageAudio.controller");
const validate = require("../../middlewares/validate");

const languagePageAudioValidation = require("../../validations/landingPageAudio.validation");

router.route("/").get(auth("common"), landingPageAudioController.getAllAudio);
router
  .route("/:audioId")
  .get(auth("common"), landingPageAudioController.getAAudioById); // playAAudioById
router.route("/").post(
  auth("commonAdmin"),
  // validate(languagePageAudioValidation.addNewLandingPageAudio),
  // FIX :  after submit validation is not working properly \"audioFile\" is required, \"languageId\" is required
  landingPageAudioController.addNewAudio
);
router
  .route("/:audioId")
  .patch(auth("commonAdmin"), landingPageAudioController.updateAudioById);

module.exports = router;
