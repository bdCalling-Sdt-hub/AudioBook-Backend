const {
  DeleteObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require("fs");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const path = require("path");
const { PassThrough } = require("stream");

// Initialize the S3 client with DigitalOcean Spaces config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${process.env.AWS_REGION}.digitaloceanspaces.com`,
  maxAttempts: 3, // Retry upload up to 3 times
  requestHandler: {
    httpOptions: {
      connectTimeout: 20000, // 5 seconds
      timeout: 420000, // 7 minute  // 240000, // 4 minutes
    },
  },
});

// Compress image file
const compressImage = async (imageBuffer, mimeType) => {
  try {
    let compressedImage;

    // Handle different formats dynamically
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      // For JPEG or JPG, use lossy compression or convert to WebP for better size with quality
      compressedImage = await sharp(imageBuffer)
        .jpeg({ quality: 50 }) // You can adjust the quality (between 0 and 100)
        .toBuffer();
    } else if (mimeType === "image/png") {
      // For PNG, use lossless compression
      compressedImage = await sharp(imageBuffer)
        .toFormat("png") // Use PNG for lossless compression
        .toBuffer();
    } else if (mimeType === "image/webp") {
      // For WebP, use lossless compression (WebP supports both lossy and lossless)
      compressedImage = await sharp(imageBuffer)
        .webp({ quality: 50 }) // You can adjust quality for WebP
        .toBuffer();
    } else {
      // For other image types, use default handling with conversion to JPEG or WebP
      compressedImage = await sharp(imageBuffer)
        .toFormat("jpeg") // Fallback to converting all to JPEG
        .jpeg({ quality: 50 })
        .toBuffer();
    }

    return compressedImage;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};


// Updated compressAudio function using streams
const compressAudio = async (inputBuffer) => {
  const passThroughStream = new PassThrough();
  return new Promise((resolve, reject) => {
    ffmpeg(inputBuffer)
      .outputOptions("-b:a", "128k") // Set bitrate to 128 kbps
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        reject(err);
      })
      .on("end", () => {
        console.log("Audio compression completed.");
        resolve(passThroughStream);
      })
      .format("mp3") // Specify the output format
      .pipe(passThroughStream, { end: true }); // Pipe the output to a PassThrough stream
  });
};


//> Latest Code  for Large file: Use streaming upload

const uploadFileToSpace = async (file, folder) => {
  // Threshold for switching upload method (1 MB)
  const STREAMING_THRESHOLD = 20* 1024 * 1024;

  // Generate a unique file name
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(
    /\s+/g,
    "-"
  )}`;

  let compressedFileBuffer;

  // Compress file based on its mime type
  if (file.mimetype.startsWith("image/")) {
    // If it's an image, compress it
    compressedFileBuffer = await compressImage(file.buffer, file.mimetype);
  } else if (file.mimetype.startsWith("audio/")) {
    // If it's an audio file, compress it
     compressedFileBuffer = await compressAudio(file.buffer, file.originalname);
    //compressedFileBuffer = file.buffer;// await compressAudio(file.buffer); // file.buffer;
  } else {
    // If it's neither image nor audio, just use the original file
    compressedFileBuffer =  file.buffer;// await compressAudio(file.buffer); //  file.buffer;
  }
  let upload;
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your Space name
      Key: fileName,
      ACL: "public-read", // Set the ACL to public-read to make the file publicly accessible
      ContentType: file.mimetype,
    };

    if (file.size <= STREAMING_THRESHOLD) {
      // Small file: Use buffer upload
      uploadParams.Body = compressedFileBuffer;

      // 🟢🟢🟢🟢 Upload the file to DigitalOcean Space
       const command = new PutObjectCommand(uploadParams);
       await s3.send(command);

    } else {
      // Large file: Use streaming upload
      // Write the compressed file buffer to a temporary file
      const tempFilePath = `${__dirname}/temp-${Date.now()}-${
        file.originalname
      }`;
      fs.writeFileSync(tempFilePath, compressedFileBuffer);

      // Stream the file from the temporary path
      uploadParams.Body = fs.createReadStream(tempFilePath);

      // 🟢🟢🟢🟢Upload the file to DigitalOcean Space
      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
    }


    // Generate the CDN URL for the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to DigitalOcean Space:", error);
    throw new Error("Failed to upload file to DigitalOcean Space");
  }
};


//> Bit Modified Code ..............
/*
// Upload file to DigitalOcean Space
const uploadFileToSpace = async (file, folder) => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(
    /\s+/g,
    "-"
  )}`;
  let compressedFileBuffer;

  // Compress file based on its mime type
  if (file.mimetype.startsWith("image/")) {
    // If it's an image, compress it
    compressedFileBuffer = await compressImage(file.buffer, file.mimetype);
  } else if (file.mimetype.startsWith("audio/")) {
    // If it's an audio file, compress it
    // compressedFileBuffer = await compressAudio(file.buffer, file.originalname);
    compressedFileBuffer = file.buffer;
  } else {
    // If it's neither image nor audio, just use the original file
    compressedFileBuffer = file.buffer;
  }

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your Space name
    Key: fileName,
    Body: compressedFileBuffer,
    ACL: "public-read", // Set the ACL to public-read to make the file publicly accessible
    ContentType: file.mimetype,
  };

  try {
    // Upload the file to DigitalOcean Space
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Generate the CDN URL for the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.${process.env.AWS_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to DigitalOcean Space:", error);
    throw new Error("Failed to upload file to DigitalOcean Space");
  }
};
*/

/* //> Original Code .......... 
// Upload file to DigitalOcean Space
const uploadFileToSpace = async (
  file, // : Express.Multer.File
  folder // : string
) => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
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


*/

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
    console.log("command", command);
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

// Compress audio file
// const compressAudio = async (fileBuffer, originalName) => {
//   return new Promise((resolve, reject) => {
//     const tempPath = path.join(__dirname, `${Date.now()}-compressed-${originalName}`);

//     ffmpeg()
//       .input(fileBuffer)
//       .inputFormat('mp3') // Assuming input is MP3, adjust if necessary
//       .audioCodec('flac') // Lossless compression (use FLAC for no quality loss)
//       .save(tempPath)
//       .on('end', () => {
//         fs.readFile(tempPath, (err, compressedBuffer) => {
//           if (err) {
//             reject('Error reading compressed audio file: ' + err);
//           } else {
//             fs.unlinkSync(tempPath); // Remove temp file
//             resolve(compressedBuffer);
//           }
//         });
//       })
//       .on('error', (err) => {
//         reject('Error compressing audio: ' + err);
//       });
//   });
// };

// // Compress image file
// const compressImage = async (imageBuffer) => {

//   try {
//     // Compress image using Sharp (lossless compression with PNG)
//     const compressedImage = await sharp(imageBuffer)
//       .toFormat('png') // Use PNG for lossless compression
//       .toBuffer();
//     return compressedImage;
//   } catch (error) {
//     console.error('Error compressing image:', error);
//     throw error;
//   }
// };
