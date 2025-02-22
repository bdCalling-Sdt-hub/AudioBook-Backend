const {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

// Initialize the S3 client with DigitalOcean Spaces config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${process.env.AWS_REGION}.digitaloceanspaces.com`,
});

// Upload file to DigitalOcean Space
const uploadFileToSpace = async (
  file, // : Express.Multer.File
  folder // : string
) => {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ACL: ObjectCannedACL.public_read,
    ContentType: file.mimetype,
  };

  try {
    // Upload the file
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Use the CDN URL for better performance
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to DigitalOcean Space:", error);
    throw new Error("Failed to upload file to DigitalOcean Space");
  }
};

// Delete a specific file from DigitalOcean Space
const deleteFileFromSpace = async (fileUrl) => {
  // : string  : Promise<void>
  const fileKey = fileUrl.split(
    `${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.cdn.digitaloceanspaces.com/`
  )[1]; // Extract the file path from the CDN URL

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    const result = await s3.send(command);
    console.log("command" , command)
    console.log(`Successfully deleted ${fileKey} from DigitalOcean Space`);
  } catch (error) {
    console.error("Error deleting from DigitalOcean Space:", error);
    throw new Error("Failed to delete file from DigitalOcean Space");
  }
};

// Delete all images from a specific folder in DigitalOcean Space
const deleteAllImagesFromSpace = async (folder = "") => {
  // : Promise<void>
  try {
    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: folder, // Specify the folder prefix if provided
    };

    const listCommand = new ListObjectsV2Command(listParams);
    const response = await s3.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      console.log("No files found to delete.");
      return;
    }

    for (const item of response.Contents) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: item.Key,
      };

      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3.send(deleteCommand);
      console.log(`Successfully deleted ${item.Key} from DigitalOcean Space`);
    }

    console.log("All images deleted successfully.");
  } catch (error) {
    console.error("Error deleting images from DigitalOcean Space:", error);
    throw new Error("Failed to delete images from DigitalOcean Space");
  }
};

module.exports = {
  uploadFileToSpace,
  deleteFileFromSpace,
  deleteAllImagesFromSpace,
};
