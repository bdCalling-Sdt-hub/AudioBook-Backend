const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const response = require("../config/response");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = catchAsync(async (req, res) => {
  const isUser = await userService.getUserByEmail(req.body.email);

  if (isUser && isUser.isEmailVerified === false) {
    const user = await userService.isUpdateUser(isUser.id, req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
        tokens,
      })
    );
  } else if (isUser && isUser.isDeleted === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  } else if (isUser && isUser.isDeleted === true) {
    // TODO : Logic ta test korte hobe ..
    // const user = await userService.isUpdateUser(isUser.id, req.body);
    // const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
      })
    );
  } else {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);


    if(user.role == "admin")
    {


      res.status(httpStatus.CREATED).json(
        response({
          message: "Thank you for registering.",
          status: "OK",
          statusCode: httpStatus.CREATED,
          data: {},
          tokens,
        })
      );
    }

    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
        tokens,
      })
    );
  }
});

// send Invitation Link for a admin
const sendInvitationLinkToAdminEmail = catchAsync(async (req, res) => {
  const isUser = await userService.getUserByEmail(req.body.email);

  if (isUser && isUser.isEmailVerified === false) {
    const user = await userService.isUpdateUser(isUser.id, req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
        tokens,
      })
    );
  } else if (isUser && isUser.isDeleted === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  } else if (isUser && isUser.isDeleted === true) {
    // TODO : Logic ta test korte hobe ..
    // const user = await userService.isUpdateUser(isUser.id, req.body);
    // const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
      })
    );
  } else {
    const user = await userService.createUser(req.body);
    // const tokens = await tokenService.generateAuthTokens(user);


    if(user.role == "admin")
    {

      // 🟢 ekhon amra email and password ta admin er email e send korbo .. 

      await emailService.sendInvitationLinkToAdminEmail(req.body.email, req?.body?.password, req?.body?.message ?? "welcome to the team");

      res.status(httpStatus.CREATED).json(
        response({
          message: "Thank you for registering.",
          status: "OK",
          statusCode: httpStatus.CREATED,
          data: {},
          // tokens,
        })
      );
    }

    res.status(httpStatus.CREATED).json(
      response({
        message: "Thank you for registering. Please verify your email",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: {},
        // tokens,
      })
    );
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const isUser = await userService.getUserByEmail(email);
  // here we check if the user is in the database or not
  if (isUser?.isDeleted === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This Account is Deleted");
  }
  if (isUser?.isEmailVerified === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email not verified");
  }
  if (!isUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  setTimeout(async () => {
    try {
      user.oneTimeCode = null;
      user.isResetPassword = false;
      await user.save();
      console.log("oneTimeCode reset to null after 3 minute");
    } catch (error) {
      ApiError;
      console.error("Error updating oneTimeCode:", error);
    }
  }, 180000); // 3 minute in milliseconds

  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).json(
    response({
      message: "Login Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
});

const logout = catchAsync(async (req, res) => {
  // await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.  OK).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
});

// gptFixd
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No users found with this email"
    );
  }

  // Check if OTP was recently requested (e.g., last 5 minutes)
  if (user.otpExpires && user.otpExpires > Date.now()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please wait before requesting a new code"
    );
  }

  // generate otp
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  // Store the OTC and its expiration time in the database
  user.oneTimeCode = oneTimeCode;
  user.isResetPassword = true;
  user.otpExpires = Date.now() + 3 * 60 * 1000; // Expire in 5 minutes
  await user.save();

  await emailService.sendResetPasswordEmail(req.body.email, oneTimeCode);
  res.status(httpStatus.OK).json(
    response({
      message: "Email Sent",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// gptFixd
const resetPassword = catchAsync(async (req, res) => {
  const { email,  password } = req.body; // oneTimeCode,
  await authService.resetPassword(password, email); // , oneTimeCode
  res.status(httpStatus.OK).json(
    response({
      message: "Password Reset Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Change Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// This is for web application
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );

  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  // const user = await authService.verifyEmail(req.body, req.query);

  const user = await authService.verifyEmail(req.body, req.user);

  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).json(
    response({
      message: "Email Verified",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
  // res.status(httpStatus.  OK).send();
});

const verifyEmailWithoutToken = catchAsync(async (req, res) => {
  console.log("Hit in verify email without token ..  🧪🧪", req.body);
  const user = await authService.verifyEmailWithoutToken(req.body);

  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).json(
    response({
      message: "Email Verified",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
  // res.status(httpStatus.  OK).send();
});

const deleteMe = catchAsync(async (req, res) => {
  const user = await authService.deleteMe(req.body.password, req.user);
  res.status(httpStatus.OK).json(
    response({
      message: "Account Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user },
    })
  );
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyEmailWithoutToken,
  deleteMe,
  changePassword,
  sendInvitationLinkToAdminEmail
};
