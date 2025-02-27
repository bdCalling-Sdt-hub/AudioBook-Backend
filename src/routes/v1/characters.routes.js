const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// TODO: Auth middleware
router.route("/").get(characterController.getAllCharacters);
// auth("common"),
// 🧪
router
  .route("/create")
  .get(auth("commonAdmin"), characterController.createCharacter);
// 🧪🧪
router.route("/audios/:characterId").post(
  [
    upload.single("audioFile"),
    // validate(characterValidation.addNewCharacter),
  ],
  auth("commonAdmin"),
  characterController.addAudioWithLanguageIdForACharacter
);
// 🧪🧪
router.route("/:characterId").put(
  // upload.fields([{ name: "coverPhoto", maxCount: 1 }]),

  [upload.single("coverPhoto")],

  auth("commonAdmin"),
  validate(characterValidation.updateCharacter),
  characterController.updateCharacter
);

//////////////////////////////////////////////////////////////////
router
  .route("/preview/update/:characterId")
  .put(auth("commonAdmin"), characterController.updateCharacterForPreviewById);

router.route("/audio/:audioId").get(characterController.getAudioById);

router
  .route("/audio/update-history/:audioId")
  .patch(auth("common"), characterController.updateHistoryOfAAudioFile);

// 🧪
// auth("common"),
router.route("/:characterId").get(characterController.getACharacterById); // playAAudioById

router
  .route("/:characterId")
  .delete(auth("commonAdmin"), characterController.deleteCharacterById);

module.exports = router;
