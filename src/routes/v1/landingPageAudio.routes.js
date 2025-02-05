const express = require("express");
const router = express.Router();

router.route("/").get(auth("common"), languageController.getAllAudio);
router.route("/:audioId").get(auth("common"), languageController.getAAudioById); // playAAudioById
router.route("/").post(auth("commonAdmin"), languageController.addNewAudio);
router
  .route("/:audioId")
  .patch(auth("commonAdmin"), languageController.updateAudioById);

module.exports = router;
