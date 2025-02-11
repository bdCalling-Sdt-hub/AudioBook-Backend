const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_CHARACTER = "./public/uploads/characters";

const uploadCharacters = userFileUploadMiddleware(UPLOADS_FOLDER_CHARACTER);

// TODO: Auth middleware
router.route("/").get(characterController.getAllCharacters);
// auth("common"),
// 🧪
router.route("/create").get(
  // auth("commonAdmin"),
  // validate(characterValidation.addNewCharacter),
  characterController.createCharacter
);
// 🧪
router.route("/audios/:characterId").post(
  [
    uploadCharacters.single("audioFile"),
    // validate(characterValidation.addNewCharacter),
  ],
  // auth("commonAdmin"),
  characterController.addAudioWithLanguageIdForACharacter
);
// 🧪
router.route("/:characterId").put(
  [uploadCharacters.fields([{ name: "coverPhoto", maxCount: 1 }])],
  // auth("commonAdmin"),
  validate(characterValidation.addNewCharacter),
  characterController.updateCharacter
);

// 🧪
router.route("/audio/:audioId").get(characterController.getAudioById);
// 🧪
router
  .route("/:characterId")
  .get(auth("common"), characterController.getACharacterById); // playAAudioById

module.exports = router;
