const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const characterService = require("../services/character.service");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const Characters = require("../models/characters.model");
const AudioFile = require("../models/audioFile.model");
const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");
const { ListeningHistory } = require("../models");
const getAudioById = catchAsync(async (req, res, userId) => {
  // const userId = req.user?._id;  // Ensure userId is optional (in case of anonymous users)

  console.log("userId 🔴🔴🔴🔴", userId);

  let audioFile = await AudioFile.findById(req.params.audioId);
  if (!audioFile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Audio not found");
  }

  if (userId) {
    // For authenticated users, fetch listening history
    const listeningHistory = await ListeningHistory.findOne({
      userId: userId,
      audioFileId: req.params.audioId,
    });

    if (listeningHistory) {
      const listeningHistoryObject = {
        progress: listeningHistory.progress,
        completed: listeningHistory.completed,
        lastListenedAt: listeningHistory.lastListenedAt,
      };
      audioFile = { ...audioFile._doc, ...listeningHistoryObject };
    } else {
      const newListeningHistory = await ListeningHistory.create({
        userId: userId,
        audioFileId: req.params.audioId,
      });
      audioFile = { ...audioFile._doc, ...newListeningHistory._doc };
    }
  }

  // For both authenticated and non-authenticated users
  res.status(httpStatus.OK).json(
    response({
      message: "Audio",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioFile,
    })
  );
});

// update History for a audio File
const updateHistoryOfAAudioFile = catchAsync(async (req, res, userId) => {
  //
  const audioFileId = req.params.audioId;

  if (userId) {
    const { progress, completed } = req.body;

    const listeningHistory = await ListeningHistory.findOne({
      userId: userId,
      audioFileId: audioFileId,
    });

    if (!listeningHistory) {
      throw new ApiError(httpStatus.NOT_FOUND, "Listening History not found");
    }

    const updatedHistory = await ListeningHistory.findByIdAndUpdate(
      listeningHistory._id,
      {
        progress: progress,
        completed: completed, //req?.body?.completed ?? false,
        lastListenedAt: Date.now(),
      },
      { new: true }
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Listening History Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedHistory,
      })
    );
  } else {
    res.status(httpStatus.OK).json(
      response({
        message: "No user found",
        status: "OK",
        statusCode: httpStatus.OK,
        data: null,
      })
    );
  }
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
  req.body.audioFile = await uploadFileToSpace(req.file, "characters");

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
    req.body.coverPhoto = await uploadFileToSpace(
      req.files.coverPhoto[0],
      "characters"
    );
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

const deleteCharacterById = catchAsync(async (req, res) => {
  const { characterId } = req.params;
  const character = await Characters.findById(characterId);

  if (!character) {
    throw new ApiError(httpStatus.NOT_FOUND, "Character not found");
  }

  // Step 2: Delete associated cover photos from DigitalOcean Space
  if (character.coverPhoto) {
    try {
      await deleteFileFromSpace(character.coverPhoto);
    } catch (error) {
      // Error handling for file deletion or DB deletion failure
      console.error("Error during file deletion:", error);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete cover photo"
      );
    }
  }

  const audioFiles = await AudioFile.find({ attachedTo: characterId });

  console.log("audioFiles🧪", audioFiles);
  if (audioFiles) {
    for (const audioFile of audioFiles) {
      try {
        await deleteFileFromSpace(audioFile.audioFile);

        await AudioFile.findByIdAndDelete(audioFile._id);
      } catch (error) {
        // Error handling for file deletion or DB deletion failure
        console.error("Error during file deletion:", error);
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Failed to delete audio file"
        );
      }
    }
  }

  // delete the character content
  await Characters.findByIdAndDelete(characterId);
  res.status(httpStatus.OK).json(
    response({
      message: "Character",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
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
  deleteCharacterById,
  updateHistoryOfAAudioFile,
};
