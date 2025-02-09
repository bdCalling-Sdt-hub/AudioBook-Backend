const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const characterService = require("../services/character.service");
const response = require("../config/response");
const { mongoose } = require("../config/config");
const audioFileService = require("../services/audioFile.service");
const ApiError = require("../utils/ApiError");

//[🚧][🧑‍💻][🧪]  // ✅ 🆗
const addNewCharacters = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.coverPhoto = "/uploads/characters/" + req.file.filename;
  }

  ////////////////////////////////////////////////

  // Step 2: Process uploaded audio files
  const audioFilesData = [];
  if (req.files && req.files.audios) {
    req.files.audios.forEach((file) => {
      // Match the uploaded file with its corresponding languageId from the request body
      const matchingAudio = req.body.audios.find(
        (audio) => audio.audioFile === file.originalname
      );
      if (!matchingAudio) {
        throw new Error(
          `No matching languageId found for audio file: ${file.originalname}`
        );
      }
      audioFilesData.push({
        audioFile: "/uploads/audioFiles/" + file.filename, // Save the file path
        languageId: matchingAudio.languageId,
      });
    });
  }

  // Step 3: Validate and create AudioFile documents
  const audioFileIds = [];
  for (const audioFileData of audioFilesData) {
    if (!mongoose.Types.ObjectId.isValid(audioFileData.languageId)) {
      return res.status(400).json({
        message: `Invalid languageId for audio file: ${audioFileData.audioFile}`,
        status: "ERROR",
        statusCode: 400,
      });
    }
    const audioFile = await audioFileService.createAudioFile(audioFileData); // Create AudioFile document
    audioFileIds.push(audioFile._id);
  }

  ////////////////////////////////////////////////

  const characterData = {
    storyTitle: req.body.storyTitle,
    coverPhoto: req.body.coverPhoto,
    audios: audioFileIds, // Reference the created AudioFile IDs
  };

  const character = await characterService.addNewCharacters(characterData);
  res.status(httpStatus.CREATED).json(
    response({
      message: "character Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: character,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]
const getAllCharacters = catchAsync(async (req, res) => {
  const result = await characterService.getAllCharacters();

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Characters not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "All Characters",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

// [🚧][🧑‍💻✅][🧪]
const getACharacterById = catchAsync(async (req, res) => {
  let character = await characterService.getCharacterById(
    req.params.characterId
  );

  if (!character) {
    throw new ApiError(httpStatus.NOT_FOUND, "Character not found");
  }

  res.status(httpStatus.CREATED).json(
    response({
      message: "Character",
      status: "OK",
      statusCode: httpStatus.OK,
      data: character,
    })
  );
});

module.exports = {
  addNewCharacters,
  getAllCharacters,
  getACharacterById,
};
