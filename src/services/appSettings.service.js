const AppSettings = require("../models/appSettings.model");

const uploadImage = async (type, filePath) => {
  try {
    // Check if a document with the same type already exists
    const existingSetting = await AppSettings.findOne({ type });

    if (existingSetting) {
      // If it exists, update the existing document with the new image
      existingSetting.image = filePath;
      const updatedSetting = await existingSetting.save();
      return updatedSetting;
    } else {
      // If it doesn't exist, create a new document
      const newSetting = await AppSettings.create({
        image: filePath,
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
