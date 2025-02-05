const express = require("express");
const router = express.Router();

// TODO : Search By Name kivabe kora jete pare .. shahinur vai er shathe discuss korte hobe ..
router.route("/").get(auth("common"), languageController.getAllCharacters); // Search By Name
router
  .route("/")
  .post(auth("commonAdmin"), languageController.addNewCharacters);
router
  .route("/:audioId")
  .get(auth("common"), languageController.getACharacterById); // playAAudioById

module.exports = router;
