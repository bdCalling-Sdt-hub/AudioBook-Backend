const express = require("express");
const auth = require("../../middlewares/auth");
const adminController = require("../../controllers/admin.controller");

const router = express.Router();

router
  .route("/deactivateUser/:userId")
  .patch(auth("commonAdmin"), adminController.deactivateUserById);
//----------------------------------------------------------------
// router
//   .route("/createNewAdmin")
//   .post(auth("superAdmin"), userController.createNewAdmin);
router
  .route("/activeDeactivateToggle/:adminId")
  .patch(auth("superAdmin"), adminController.activeDeactivateToggleAdminById);

router
  .route("/getAllAdminAndSuperAdmin")
  .get(auth("commonAdmin"), adminController.getAllAdminAndSuperAdmin);

module.exports = router;
