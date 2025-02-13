const express = require("express");
const router = express.Router();
const locationValidation = require("../../validations/location.validation");
const locationController = require("../../controllers/location.controller");
const validate = require("../../middlewares/validate");

router.route("/").get(locationController.getAllLocation);

router.route("/").post(locationController.createLocation);

router.route("/:locationId").delete(locationController.deleteLocation);

// TODO: UpdateLocation
router.route("/:locationId").put(
  validate(locationValidation.updateLocation),

  locationController.updateLocation
);

module.exports = router;

// FIXME : Shob route er authentication Must Fix korte hobe ..
