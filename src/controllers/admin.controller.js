const httpStatus = require("http-status");
const pick = require("../utils/pick");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");

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

const deactivateAdminById = catchAsync(async (req, res) => {
  const user = await userService.deactivateAdminById(req.params.adminId);
  res.status(httpStatus.OK).json(
    response({
      message: "Admin deactivated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

//[🚧][🧑‍💻][]  // ✅  🧪🆗✔️
const getAllAdminAndSuperAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["fullName"]);

  // Add role filter to only fetch users with role "user"
  filter.role = { $in: ["admin", "superAdmin"] };

  const options = pick(req.query, []);
  const result = await userService.queryUsers(filter, options);

  res.status(httpStatus.CREATED).json(
    response({
      message: "getAllAdminAndSuperAdmin",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

module.exports = {
  deactivateUserById, // admin functionality

  deactivateAdminById,
  getAllAdminAndSuperAdmin,
};
