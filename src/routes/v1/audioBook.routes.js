const express = require("express");
const router = express.Router();

// TODO : Search By Name  er case e idea lagbe Shahinur vai er theke
router.route("/").get(auth("common"), languageController.getAllAudioBook);
router.route("/").post(auth("commonAdmin"), languageController.addNewAudioBook);
router
  .route("/:audioBookId")
  .patch(auth("commonAdmin"), languageController.updateAudioBookById);
router
  .route("preview/:audioBookId")
  .patch(auth("commonAdmin"), languageController.editPreviewById);
router
  .route("/:audioBookId")
  .get(auth("common"), languageController.getAAudioBookById);

module.exports = router;
