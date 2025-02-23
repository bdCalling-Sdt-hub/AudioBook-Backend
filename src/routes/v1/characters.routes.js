const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const characterController = require("../../controllers/character.controller");
const characterValidation = require("../../validations/character.validation");
const validate = require("../../middlewares/validate");
const jwt = require("jsonwebtoken"); // Assuming you're using JWT

const multer = require("multer");
const { error } = require("winston");
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

// 🧪auth("common"),
router.route("/audio/:audioId").get(async (req, res) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  // If no token is provided, handle as anonymous access
  if (!token) {
    await characterController.getAudioById(req, res, null);
    // await characterController.playAAudioById(req,res,null);
  } else {
    try {
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode", decoded);

      // If token is valid, decode it and extract the userId
      const userId = decoded.sub;
      await characterController.getAudioById(req, res, userId);
      console.log("Authenticated user, userId:", userId);
    } catch (error) {
      // Handle errors related to invalid or expired tokens
      console.error("Invalid or expired token:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
});

// router.route("/audio/update-history/:audioId").get(auth("common"),characterController.updateHistoryOfAAudioFile);

router.route("/audio/update-history/:audioId").patch(async (req, res) => {
  console.log("req.body from patch routes 🩷🩷🩷 :", req);
  const token = req.headers.authorization?.split(" ")[1];
  // If no token is provided, handle as anonymous access
  if (!token) {
    await characterController.updateHistoryOfAAudioFile(req, res, null);
  } else {
    try {
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.sub;

      await characterController.updateHistoryOfAAudioFile(req, res, userId);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
});

// 🧪
// auth("common"),
router.route("/:characterId").get(characterController.getACharacterById); // playAAudioById

router
  .route("/:characterId")
  .delete(auth("commonAdmin"), characterController.deleteCharacterById);

module.exports = router;
