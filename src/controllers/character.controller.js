const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const characterService = require("../services/character.service");
const response = require("../config/response");
const { mongoose } = require("../config/config");
const audioFileService = require("../services/audioFile.service");
const ApiError = require("../utils/ApiError");
const Characters = require("../models/characters.model");
const AudioFile = require("../models/audioFile.model");
const { uploadFileToSpace } = require("../middlewares/digitalOcean");

const getAudioById = catchAsync(async (req, res) => {
  const audioFile = await AudioFile.findById(req.params.audioId);
  if (!audioFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Audio not found");
  }
  res.status(httpStatus.OK).json(
    response({
      message: "Audio",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioFile,
    })
  );
});

// when a commonAdmin click to add Character button .. then it create a
// empty character in database and return thats id ..

const createCharacter = catchAsync(async (req, res) => {
  const newCharacter = await Characters.create({ published: false });

  res.status(httpStatus.CREATED).json(
    response({
      message: "Character Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: newCharacter,
    })
  );
});

const addAudioWithLanguageIdForACharacter = catchAsync(async (req, res) => {
  const characterId = req.params.characterId; // audioFile er attachedTo field e characterId save korbo

  if (characterId) {
    req.body.attachedTo = characterId;
  }

  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "No audio file uploaded",
        status: "ERROR",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  // if (req.file) {
  //   req.body.audioFile = "/uploads/characters/" + req.file.filename;
  // }

  // const imageUrl =
  req.body.audioFile = await uploadFileToSpace(req.file, "characters"); // images // TODO: eta ki folder Name ? rakib vai ke ask korte hobe

  // FIX: Validate that languageId is a valid .. but this give me error ..tai comment kore rakhsi .. but eta fix kora lagbe ..
  // if (!mongoose.Types.ObjectId.isValid(req.body.languageId)) {
  //   return res.status(400).json(
  //     response({
  //       message: "Invalid languageId. Please provide a valid ObjectId.",
  //       status: "ERROR",
  //       statusCode: httpStatus.BAD_REQUEST,
  //     })
  //   );
  // }

  const audioFile = AudioFile.create(req.body);

  res.status(httpStatus.CREATED).json(
    response({
      message: "Audio Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: audioFile,
    })
  );
});

//[🚧][🧑‍💻][🧪]  // ✅ 🆗
const updateCharacter = catchAsync(async (req, res) => {
  // TODO : already created character chara update kora jabe na ..
  // TODO : validation lagbe must ..
  if (req.files.coverPhoto) {
    // req.body.coverPhoto =
    //   "/uploads/characters/" + req.files.coverPhoto[0].filename;

    req.body.coverPhoto = await uploadFileToSpace(
      req.files.coverPhoto[0],
      "characters"
    ); // images // TODO: eta ki folder Name ? rakib vai ke ask korte hobe
  }

  // Step 0 : search for audioFiles from audioFile Table and get  audioFileId which are
  // related to this character Id

  const audioFileIds = await AudioFile.find(
    {
      attachedTo: req.params.characterId,
    },
    { _id: 1 }
  );

  // Step 2: Process uploaded audio files
  const audioFileIDs = [];

  for (const audioFileId of audioFileIds) {
    audioFileIDs.push(audioFileId._id);
  }

  const characterData = {
    storyTitle: req.body.storyTitle,
    coverPhoto: req.body.coverPhoto,
    audios: audioFileIDs, // Reference the created AudioFile IDs
    published: true,
  };

  // const character = await characterService.addNewCharacters(characterData);
  const character = await Characters.findByIdAndUpdate(
    req.params.characterId,
    characterData,
    { new: true }
  );
  res.status(httpStatus.OK).json(
    response({
      message: "character Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: character, // character
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
  createCharacter,
  addAudioWithLanguageIdForACharacter,
  updateCharacter,
  getAllCharacters,
  getACharacterById,
  getAudioById,
};
