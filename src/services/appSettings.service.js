const httpStatus = require("http-status");
const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");
const AppSettings = require("../models/appSettings.model");
const ApiError = require("../utils/ApiError");

// TODO : eta fix korte hobe .. previous image Digital Ocean theke delete hocche na ..
// FIXME:
const uploadImage = async (type, file) => {
  try {
    // Check if a document with the same type already exists
    const existingSetting = await AppSettings.findOne({ type });

    if (existingSetting) {
      console.log("existingSetting.image 🧪🧪 ", existingSetting.image);
      // If it exists, update the existing document with the new image

      // last image ta age delete korte hobe

      try {
       await deleteFileFromSpace(existingSetting.image);
      
      } catch (error) {
        // Error handling for file deletion or DB deletion failure
        console.error("Error during file deletion:", error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete settings image");
      }
     

      existingSetting.image = await uploadFileToSpace(file, "appSettings");

      const updatedSetting = await existingSetting.save();
      return updatedSetting;
    } else {
      const imageUrl = await uploadFileToSpace(file, "appSettings");
      // If it doesn't exist, create a new document
      const newSetting = await AppSettings.create({
        image: imageUrl,
        type,
      });

      return newSetting;
    }
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
};
