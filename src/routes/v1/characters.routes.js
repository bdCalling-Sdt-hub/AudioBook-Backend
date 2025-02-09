const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_CHARACTER = "./public/uploads/characters";

const uploadCharacters = userFileUploadMiddleware(UPLOADS_FOLDER_CHARACTER);

// TODO : Search By Name kivabe kora jete pare .. shahinur vai er shathe discuss korte hobe ..
router.route("/").get(auth("common"), characterController.getAllCharacters); // Search By Name
// router
//   .route("/")
//   .post(
//     auth("commonAdmin"),
//     [uploadLanguage.single("coverPhoto")],
//     convertHeicToPngMiddleware(UPLOADS_FOLDER_LANGUAGE),
//     validate(characterValidation.addNewCharacter),
//     characterController.addNewCharacters
//   );

router.route("/").post(
  [
    uploadCharacters.fields([
      { name: "coverPhoto", maxCount: 1 },
      { name: "audios", maxCount: 10 }, // Allow up to 10 audio files
    ]),
  ],
  auth("commonAdmin"),
  validate(characterValidation.addNewCharacter),
  characterController.addNewCharacters
);

router
  .route("/:characterId")
  .get(auth("common"), characterController.getACharacterById); // playAAudioById

module.exports = router;
