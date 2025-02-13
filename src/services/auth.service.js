const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

const loginUserWithEmailAndPassword = async (email, password) => {
  // console.log("email", email);
  const user = await userService?.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

//working
const resetPassword = async (newPassword, email, oneTimeCode) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // check OTP is correct

  if (user.oneTimeCode !== oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  // Check if OTP has expired
  if (user.otpExpires < Date.now()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "OTP expired. Request a new one."
    );
  }

  // Check if new password is same as old password
  if (await user.isPasswordMatch(newPassword)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password"
    );
  }

  // ✅ Update Password and Hash it
  user.password = newPassword; // Ensure password hashing is applied

  // Clear OTP and expiry after successful reset
  user.oneTimeCode = null;
  user.otpExpires = null;
  user.isResetPassword = false;
  await user.save();

  return user;
};

const changePassword = async (reqUser, reqBody) => {
  const { oldPassword, newPassword } = reqBody;
  const user = await userService.getUserByEmail(reqUser.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  if (await user.isPasswordMatch(newPassword)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password"
    );
  }
  user.password = newPassword;
  await user.save();
  return user;
};

const verifyEmail = async (reqBody, user) => {
  // (reqBody, reqQuery)
  const { oneTimeCode } = reqBody;
  // const { email, oneTimeCode } = reqBody;

  const user1 = await userService.getUserByEmail(user.email);

  if (!user1) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  } else if (user1.oneTimeCode === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  } else if (oneTimeCode != user1.oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  } else if (user1.isEmailVerified && !user1.isResetPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");
  } else {
    user1.isEmailVerified = true;
    user1.oneTimeCode = null;
    user1.isResetPassword = false;
    await user1.save();
    return user1;
  }
};

const verifyEmailWithoutToken = async (reqBody) => {
  // (reqBody, reqQuery)
  const { oneTimeCode, email } = reqBody;

  const user1 = await userService.getUserByEmail(email);

  if (!user1) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  } else if (user1.oneTimeCode === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  } else if (oneTimeCode != user1.oneTimeCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  } else if (user1.isEmailVerified && !user1.isResetPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");
  } else {
    user1.isEmailVerified = true;
    user1.oneTimeCode = null;
    user1.isResetPassword = false;
    await user1.save();
    return user1;
  }
};

const verifyNumber = async (phoneNumber, otpCode, email) => {
  console.log("reqBody", email);
  console.log("reqQuery", otpCode);
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  } else if (user.phoneNumberOTP === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  } else if (otpCode != user.phoneNumberOTP) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  } else if (user.isPhoneNumberVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone Number already verified");
  } else {
    user.isPhoneNumberVerified = true;
    user.phoneNumberOTP = null;
    await user.save();
    return user;
  }
};

const deleteMe = async (password, reqUser) => {
  const user = await userService.getUserByEmail(reqUser.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  user.isDeleted = true;
  await user.save();
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  verifyEmailWithoutToken,
  deleteMe,
  changePassword,
  verifyNumber,
};
