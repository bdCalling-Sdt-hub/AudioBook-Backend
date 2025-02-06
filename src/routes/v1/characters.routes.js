const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");

// TODO : Search By Name kivabe kora jete pare .. shahinur vai er shathe discuss korte hobe ..
router.route("/").get(auth("common"), characterController.getAllCharacters); // Search By Name
router
  .route("/")
  .post(
    auth("commonAdmin"),
    validate(characterValidation.addNewCharacter),
    characterController.addNewCharacters
  );
router
  .route("/:characterId")
  .get(auth("common"), characterController.getACharacterById); // playAAudioById

module.exports = router;
