const express = require("express");
const router = express.Router();

const locationController = require("../../controllers/location.controller");

router.route("/").get(locationController.getAllLocation);

// TODO: CreateLocation
// TODO: UpdateLocation
// TODO: DeleteLocation

module.exports = router;
