const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

//🧪 working
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

//🧪 working
router.post("/login", validate(authValidation.login), authController.login);

//🧪 working
router.post(
  "/verify-email-with-token",
  auth("common"),
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

//🧪 working
router.post(
  "/verify-email",
  validate(authValidation.verifyEmailWithEmailAndOTP),
  authController.verifyEmailWithoutToken
);

// it sends verification code for the forgot password
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

// 🔴 this is for web application
router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);

//🧪 working
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
//🧪 working
router.post(
  "/change-password",
  auth("common"),
  validate(authValidation.changePassword),
  authController.changePassword
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
