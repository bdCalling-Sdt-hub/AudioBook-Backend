const express = require("express");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/").get(auth("commonAdmin"), userController.getUsers);

//--------- TODO: route created by Shahinur vai..
router
  .route("/:userId")
  .get(auth("common"), userController.getUser)
  .patch(
    auth("common"),
    [uploadUsers.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    userController.updateUser
  );

module.exports = router;
