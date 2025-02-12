const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");
const AppSettings = require("../models/appSettings.model");

// TODO : eta fix korte hobe .. previous image Digital Ocean theke delete hocche na ..

const uploadImage = async (type, file) => {
  try {
    // Check if a document with the same type already exists
    const existingSetting = await AppSettings.findOne({ type });

    if (existingSetting) {
      console.log("existingSetting.image 🧪🧪 ", existingSetting.image);
      // If it exists, update the existing document with the new image

      // last image ta age delete korte hobe

      const res = await deleteFileFromSpace(existingSetting.image);

      await console.log("🧪 app settings ", type, "🧪  ", res);

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
