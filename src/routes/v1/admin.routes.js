const express = require("express");
const auth = require("../../middlewares/auth");
const adminController = require("../../controllers/admin.controller");

const router = express.Router();

router
  .route("/deactivateUser/:userId")
  .get(auth("commonAdmin"), adminController.deactivateUserById);
//----------------------------------------------------------------
// router
//   .route("/createNewAdmin")
//   .post(auth("superAdmin"), userController.createNewAdmin);
router
  .route("/deactivateAdmin/:adminId")
  .get(auth("superAdmin"), adminController.deactivateAdminById);
router
  .route("/getAllAdminAndSuperAdmin")
  .get(auth("commonAdmin"), adminController.getAllAdminAndSuperAdmin);

module.exports = router;
