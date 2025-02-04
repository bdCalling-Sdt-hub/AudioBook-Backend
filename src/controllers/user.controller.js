const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");
const { User, Interest } = require("../models");

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

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "gender"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
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



const userRatioCount = catchAsync(async (req, res) => {
  const thisMonthClint = await User.countDocuments({
    createdAt: { $gte: new Date().setMonth(new Date().getMonth() - 1) },
    role: "client",
  });
  const thisMonthEmployee = await User.countDocuments({
    createdAt: { $gte: new Date().setMonth(new Date().getMonth() - 1) },
    role: "employee",
  });

  const ratio = [
    { name: "Client", value: thisMonthClint },
    { name: "Employee", value: thisMonthEmployee },
  ];

  res.status(httpStatus.OK).json(
    response({
      message: "User Ratio List",
      status: "OK",
      statusCode: httpStatus.OK,
      data: ratio,
    })
  );
});
const userInterestUpdate = catchAsync(async (req, res) => {
  const user = await userService.userInterestUpdate(req.user.id, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "User Interest Update",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const interestAdd = catchAsync(async (req, res) => {
  const interest = await Interest.create(req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "Interest add successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const interestDelete = catchAsync(async (req, res) => {
  const interest = await Interest.findByIdAndDelete(req.query.interestId);
  res.status(httpStatus.OK).json(
    response({
      message: "Interest Deleted",
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
  userRatioCount,
  userInterestUpdate,
  interestAdd,
  interestDelete
};
