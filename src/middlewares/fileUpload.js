// const multer = require("multer");
// const path = require("path");

// module.exports = function (UPLOADS_FOLDER) {
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, UPLOADS_FOLDER); // Use the provided destination folder
//     },
//     filename: (req, file, cb) => {
//       const fileExt = path.extname(file.originalname);
//       const filename =
//         file.originalname
//           .replace(fileExt, "")
//           .toLocaleLowerCase()
//           .split(" ")
//           .join("-") +
//         "-" +
//         Date.now();

//       cb(null, filename + fileExt);
//     },
//   });

//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 500 * 1024 * 1024 //500MB
//     },
//     fileFilter: (req, file, cb) => {
//       if (
//         file.mimetype == "image/jpg" ||
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpeg" ||
//         file.mimetype == "image/heic" ||
//         file.mimetype == "image/heif" ||
//         file.mimetype == "audio/mpeg" || // MP3
//         file.mimetype == "audio/wav" || // WAV
//         file.mimetype == "audio/ogg" // OGG
//       ) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only jpg, png, jpeg, mpeg, wav, ogg  format allowed!"));
//       }
//     },
//   });

//   return upload; // Return the configured multer upload middleware
// };


const multer = require("multer");
const path = require("path");

module.exports = function (UPLOADS_FOLDER) {

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER); // Use the provided destination folder
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLocaleLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, filename + fileExt);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 500000000000 //500MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/heic" ||
        file.mimetype == "image/heif" ||
        file.mimetype == "audio/mpeg" || // MP3
        file.mimetype == "audio/wav" || // WAV
        file.mimetype == "audio/ogg" // OGG
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg, mpeg, wav, ogg format allowed!"));
      }
    },
  });
  return upload; // Return the configured multer upload middleware
};
