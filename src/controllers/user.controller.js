const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");

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

// TODO : Shahinur vai ke ask korte hobe .. shob user ke query korar bepar e ...
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

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers();
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

// ----------------------Admin Functionality------------------

// cross check korte hobe ..
const deactivateUserById = catchAsync(async (req, res) => {
  const user = await userService.deactivateUserById(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deactivated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const createNewAdmin = catchAsync(async (req, res) => {
  const user = await userService.createNewAdmin(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Admin Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const deactivateAdminById = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).json(
    response({
      message: "Admin deactivated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const getAllAdminAndSuperAdmin = catchAsync(async (req, res) => {
  res.status(httpStatus.CREATED).json(
    response({
      message: "getAllAdminAndSuperAdmin",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

module.exports = {
  createUser,
  getAllUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUserById, // admin functionality
  createNewAdmin,
  deactivateAdminById,
  getAllAdminAndSuperAdmin,
};
