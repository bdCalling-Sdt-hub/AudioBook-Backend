const Characters = require("../models/characters.model");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const characterService = require("../services/character.service");
const response = require("../config/response");
// 🚧
const addNewCharacters = catchAsync(async (req, res) => {
  const character = await characterService.addNewCharacters(req.body);
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

  res.status(httpStatus.CREATED).json(
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
