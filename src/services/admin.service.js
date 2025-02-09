const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const deactivateAdminById = async (adminId) => {
  const admin = await User.findById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
  Object.assign(admin, { status: "deactivate" });
  await admin.save();
  return admin;
};

const deactivateUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "admin" || user.role === "superAdmin") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Admin cannot be deactivated by user"
    );
  }
  Object.assign(user, { status: "deactivate" });
  await user.save();
  return user;
};

module.exports = {
  deactivateAdminById,
  deactivateUserById,
};
