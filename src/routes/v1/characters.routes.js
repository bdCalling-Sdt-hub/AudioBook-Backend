const express = require("express");
const router = express.Router();

const characterController = require("../../controllers/character.controller");

// TODO : Search By Name kivabe kora jete pare .. shahinur vai er shathe discuss korte hobe ..
router.route("/").get(auth("common"), characterController.getAllCharacters); // Search By Name
router
  .route("/")
  .post(auth("commonAdmin"), characterController.addNewCharacters);
router
  .route("/:audioId")
  .get(auth("common"), characterController.getACharacterById); // playAAudioById

module.exports = router;
