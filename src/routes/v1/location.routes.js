const express = require("express");
const router = express.Router();

const locationController = require("../../controllers/location.controller");

router.route("/").get(locationController.getAllLocation);

router.route("/").post(locationController.createLocation);

router.route("/:locationId").delete(locationController.deleteLocation);

// TODO: UpdateLocation

module.exports = router;
