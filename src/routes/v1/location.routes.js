const express = require("express");
const router = express.Router();
const locationValidation = require("../../validations/location.validation");
const locationController = require("../../controllers/location.controller");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

router.route("/").get(locationController.getAllLocation);


router.route("/forAdmin").get(locationController.getAllLocationForAdmin);


router.route("/").post(auth("commonAdmin"), locationController.createLocation);

router
  .route("/:locationId")
  .delete(auth("commonAdmin"), locationController.deleteLocation);

// TODO: UpdateLocation
router.route("/:locationId").put(
  auth("commonAdmin"),
  validate(locationValidation.updateLocation),

  locationController.updateLocation
);

module.exports = router;
