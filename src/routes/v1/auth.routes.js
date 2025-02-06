const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);

router.post(
  "/verify-email",
  auth("common"),
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

// 🔴 this is for web application
router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
// test korte hobe ..
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
// test korte hobe
router.post(
  "/change-password",
  auth("common"),
  validate(authValidation.changePassword),
  authController.changePassword
);
// test korte hobe
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post("/logout", validate(authValidation.logout), authController.logout);
// test korte hobe ..
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

router.post(
  "/delete-me",
  auth("user"),
  validate(authValidation.deleteMe),
  authController.deleteMe
);

module.exports = router;
