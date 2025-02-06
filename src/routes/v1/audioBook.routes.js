const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const audioBookController = require("../../controllers/audioBook.controller");

// TODO : Search By Name  er case e idea lagbe Shahinur vai er theke
router.route("/").get(auth("common"), audioBookController.getAllAudioBook);
router
  .route("/")
  .post(auth("commonAdmin"), audioBookController.addNewAudioBook);
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
