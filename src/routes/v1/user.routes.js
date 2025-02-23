const express = require("express");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user.controller");
const router = express.Router();
router.route("/").get(auth("commonAdmin"), userController.getUsers);

router.route("/history").get(auth("common"), userController.getHistory);

// INFO : route created by Shahinur vai..
router.route("/:userId").get(auth("common"), userController.getUser);




module.exports = router;
