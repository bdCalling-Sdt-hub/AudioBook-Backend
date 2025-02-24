const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const { ListeningHistory, AudioFile, AudioBook, Characters } = require("../models");


const getHistory = catchAsync(async (req, res) => {
  const history = await ListeningHistory.find({ userId: req.user._id }).sort({ lastListenedAt: -1 }).select('-createdAt -updatedAt -lastListenedAt -__v').populate({
    path: "audioFileId",
    
    select: "-createdAt -updatedAt -__v",
    populate: {
      path: "languageId",
      select: "name flagImage",
    },
  });

  // loop to history and get audioFileId and check if that audioFile exist in audioFile database
  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, "History not found");
  }

  const histories = [];

  if(history){
    for (const h of history) {
      const audioFile = await AudioFile.findById(h.audioFileId);
      if (audioFile) {
        let audioFileBelongTo = audioFile.attachedTo;

        const audioBookData = await AudioBook.findById(audioFileBelongTo).select(' -audios -locationId -published -createdAt -updatedAt -__v');
        
        const characterData = await Characters.findById(audioFileBelongTo).select(' -audios -published -createdAt -updatedAt -__v');

        if(audioBookData){
          audioFileBelongTo =  audioBookData;
        }else if(characterData){
          audioFileBelongTo =  characterData;
        } 
        histories.push({  ...h._doc, audioFileBelongTo  });
      }
    }
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User History",
      status: "OK",
      statusCode: httpStatus.OK,
      data: histories,
    })
  );

})

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗✔️]  //
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["fullName"]);

  // Add role filter to only fetch users with role "user"
  filter.role = "user";

  const options = pick(req.query, []);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Users",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateUser = catchAsync(async (req, res) => {
  if (req.body.interest) {
    const parsedInterest = JSON.parse(req.body.interest);
    req.body.interest = parsedInterest;
  }
  const image = {};
  if (req.file) {
    image.url = "/uploads/users/" + req.file.filename;
    image.path = req.file.path;
  }
  if (req.file) {
    req.body.image = image;
  }

  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getHistory
};
