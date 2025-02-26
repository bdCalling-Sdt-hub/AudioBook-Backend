const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");
const jwt = require("jsonwebtoken"); // Assuming you're using JWT
const audioBookValidation = require("../../validations/audioBook.validation");
const multer = require("multer");
const { error } = require("winston");
const catchAsync = require("../../utils/catchAsync");
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
router
  .route("/:characterId")
  .put(
    upload.fields([{ name: "coverPhoto", maxCount: 1 }]),
    auth("commonAdmin"),
    validate(characterValidation.addNewCharacter),
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

// router.route("/audio/update-history/:audioId").patch(async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     try{
//     await characterController.updateHistoryOfAAudioFile(req, res, null);
//   }
//   catch (error) {
//     return res.status(401).json({ message: "Error from updateHistoryOfAAudioFile" });
//   }
//   } else {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.sub;
//       await characterController.updateHistoryOfAAudioFile(req, res, userId);

//     } catch (error) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   }
// });
