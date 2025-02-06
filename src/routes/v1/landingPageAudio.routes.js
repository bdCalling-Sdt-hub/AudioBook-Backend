const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const landingPageAudioController = require("../../controllers/landingPageAudio.controller");

router.route("/").get(auth("common"), landingPageAudioController.getAllAudio);
router
  .route("/:audioId")
  .get(auth("common"), landingPageAudioController.getAAudioById); // playAAudioById
router
  .route("/")
  .post(auth("commonAdmin"), landingPageAudioController.addNewAudio);
router
  .route("/:audioId")
  .patch(auth("commonAdmin"), landingPageAudioController.updateAudioById);

module.exports = router;
