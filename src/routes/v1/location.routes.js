const express = require("express");
const router = express.Router();

const locationController = require("../../controllers/location.controller");

router.route("/").get(locationController.getAllLocation);

module.exports = router;
