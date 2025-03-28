const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");
const audioBookService = require("../services/audioBook.service");
const AudioBook = require("../models/audioBook.model");
const pick = require("../utils/pick");
const Location = require("../models/location.model");
const AudioFile = require("../models/audioFile.model");

const {
  uploadFileToSpace,
  deleteFileFromSpace,
} = require("../middlewares/digitalOcean");

//[🚧][🧑‍💻✅][🧪🆗✔️] //
const createAudioBook = catchAsync(async (req, res) => {
  const newCharacter = await AudioBook.create({ published: false });

  res.status(httpStatus.CREATED).json(
    response({
      message: "AudioBook Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: newCharacter,
    })
  );
});

// FIX : audioBook Id valid kina sheta niye pore chinta kortesi ...
//[🚧][🧑‍💻✅][🧪🆗✔️] //
const addAudioWithLanguageIdForAudioBook = catchAsync(async (req, res) => {

  console.log("Consle loge rakib ================= == == = = 🔗🔗🔗 ", req.file)


  const audioBookId = req.params.audioBookId;

  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    // throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "AudioBook not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  if (audioBookId) {
    req.body.attachedTo = audioBookId;
  }

  if (!req.file) {
    return res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "No audio file uploaded",
        status: "ERROR",
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  }

  if (req.file) {
    console.log("Audio File🟢🟢",req.file)
    const uploadToSpace = await uploadFileToSpace(req.file, "audioBooks");
    if(!uploadToSpace){
      throw new ApiError(httpStatus.NOT_FOUND, "AudioFile is  not Uploaded");
    }
     req.body.audioFile = uploadToSpace
  }

  const audioFile = await AudioFile.create(req.body);

  if(!audioFile){
    throw new ApiError(httpStatus.NOT_FOUND, "AudioFile is  not Created");
  }

  res.status(httpStatus.CREATED).json(
    response({
      message: "Audio Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: audioFile,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗]
const getAllAudioBook = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["storyTitle", "locationId", "isPreview"]);
  const options = pick(req.query, []);
  const audioBook = await audioBookService.queryAudioBooks(filter, options);

  res.status(httpStatus.OK).json(
    response({
      message: "All AudioBooks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioBook,
    })
  );
});
const getAllAudioBookForAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["storyTitle", "locationId", "isPreview"]);
  const options = pick(req.query, []);
  const audioBook = await audioBookService.queryAudioBookForAdmin(
    filter,
    options
  );

  res.status(httpStatus.OK).json(
    response({
      message: "All AudioBooks",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioBook,
    })
  );
});

//Delete AudioFile .. this is also for Character
const deleteAudioFile = catchAsync(async (req, res) => {
  const audioFileId = req.params.audioFileId;

  const audioFile = await AudioFile.findById(audioFileId);
  if (!audioFile) {
    // throw new ApiError(httpStatus.NOT_FOUND, "Audio File not found");

    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Audio not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  try {
    // Delete image from DigitalOcean Space
    await deleteFileFromSpace(audioFile.audioFile);

    await audioFile.deleteOne();
  } catch (error) {
    // Error handling for file deletion or DB deletion failure
    console.error("Error during file deletion:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete audio file"
    );
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Audio File Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioFile,
    })
  );
});

//[🚧][ 🧑‍💻✅][🧪🆗]
const getAAudioBookById = catchAsync(async (req, res) => {
  // let audioBook = await AudioBook.findById(req.params.audioBookId).populate({
  //   path: "audios", // Populate the 'audios' field
  //   select: " -createdAt -updatedAt -__v", // -audioFile
  //   populate: {
  //     path: "languageId", // Populate the 'languageId' field within 'audios'
  //     select: "-createdAt -updatedAt -__v",
  //   },
  // });

  const { isPreview } = req.query;

  const isPreviewFilter =
    isPreview !== undefined ? { isPreview: isPreview === "true" } : {};

  let audioBook = await AudioBook.findById(req.params.audioBookId)
    .populate({
      path: "audios locationId", // Populate the 'audios' field
      match: isPreviewFilter,
      select: "-createdAt -updatedAt -__v", // Exclude unwanted fields from audios
      populate: [
        {
          path: "languageId", // Populate 'languageId'
          select: "-createdAt -updatedAt -__v", // Exclude unwanted fields from Language model
        },
      ],
    })
    .populate({
      path: "locationId", // Populate 'locationId'
      select: "-createdAt -updatedAt -__v", // Exclude unwanted fields from Location model
    });

  if (!audioBook) {
    // throw new ApiError(httpStatus.NOT_FOUND, "audioBook not found");

    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "AudioBook not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  res.status(httpStatus.OK).json(
    response({
      message: "AudioBook",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioBook,
    })
  );
});

//[🚧][🧑‍💻✅][🧪🆗] //

const updateAudioBookById = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Assuming the audiobook ID is passed as a URL parameter

  // Step 0: Fetch the existing audiobook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    // throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");

    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Audio Book not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  // Step 1: Process uploaded cover photos (if any)

  // ❌ Bad Way
  // const coverPhotos = [];
  // if (req.files && req.files.coverPhotos) {
  //   req.files.coverPhotos.forEach(async (file) => {
  //     const coverPhotoUrl = await uploadFileToSpace(file, "audioBooks");

  //     await coverPhotos.push(coverPhotoUrl);
  //   });
  // }

  // ✅ Right Way  // TODO : Right Way te shob gula korte hobe baki shob jaygay ..

  let coverPhotos = [...audioBook.coverPhotos];

  if (req.files && req.files.coverPhotos) {
    coverPhotos.push(
      ...(await Promise.all(
        req.files.coverPhotos.map(async (file) => {
          const coverPhotoUrl = await uploadFileToSpace(file, "audioBooks");
          return coverPhotoUrl;
        })
      ))
    );
  }
  // else {
  //   coverPhotos = [...audioBook.coverPhotos];
  // }

  // Step 0 : search for audioFiles from audioFile Table and get  audioFileId which are
  // related to this character Id

  const audioFileIds = await AudioFile.find(
    {
      attachedTo: req.params.audioBookId,
    },
    { _id: 1 }
  );

  // Step 2: Process uploaded audio files
  const audioFileIDs = [];

  for (const audioFileId of audioFileIds) {
    audioFileIDs.push(audioFileId._id);
  }

  const audioBookData = {
    storyTitle: req.body.storyTitle,
    coverPhotos: coverPhotos,
    audios: audioFileIDs, // Reference the created AudioFile IDs
    published: true,
  };

  // Step 4: Handle location updates
  if (req.body.locationId) {
    const locationExist = await Location.findById(req.body.locationId);

    if (locationExist) {
      // Check if the locationId is being changed
      if (audioBook.locationId?.toString() !== req.body.locationId) {
        audioBookData.locationId = locationExist._id;

        // Increment the count for the new location
        await Location.findByIdAndUpdate(locationExist._id, {
          $inc: { count: 1 }, // Increment the count by 1
        });

        // Decrement the count for the previous location (if it exists)
        if (audioBook.locationId) {
          await Location.findByIdAndUpdate(audioBook.locationId, {
            $inc: { count: -1 }, // Decrement the count by 1
          });
        }
      }
    } else {
      // throw new ApiError(httpStatus.NOT_FOUND, "Location not found");

      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Location not found",
          status: "NOT_FOUND",
          statusCode: httpStatus.NOT_FOUND,
          data: null,
        })
      );
    }
  }

  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    audioBookData,
    { new: true }
  );

  // Return success response
  res.status(200).json({
    message: "AudioBook Updated",
    status: "OK",
    statusCode: 200,
    data: updatedAudioBook,
  });
});

/////////////////////////////////////// Update Only Audios of Audio Book

const updateAudioBookForPreviewById = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Assuming the audiobook ID is passed as a URL parameter

  // Step 0: Fetch the existing audiobook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    // throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");

    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "Audio Book not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  // Step 0 : search for audioFiles from audioFile Table and get  audioFileId which are
  // related to this character Id

  const audioFileIds = await AudioFile.find(
    {
      attachedTo: req.params.audioBookId,
    },
    { _id: 1 }
  );

  // Step 2: Process uploaded audio files
  const audioFileIDs = [];

  for (const audioFileId of audioFileIds) {
    audioFileIDs.push(audioFileId._id);
  }

  const audioBookData = {
    audios: audioFileIDs, // Reference the created AudioFile IDs
    published: true,
  };

  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    audioBookData,
    { new: true }
  );

  // Return success response
  res.status(200).json({
    message: "AudioBook Updated",
    status: "OK",
    statusCode: 200,
    data: updatedAudioBook,
  });
});

//////////////////////////////////////// Update Audio File By Id

const updateAudioFileByAudioId = catchAsync(async (req, res) => {
  const { audioFileId } = req.params;

  // Step 0: Fetch the existing audiobook
  const audioFile = await AudioFile.findById(audioFileId);
  if (!audioFile) {
    // throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");

    res.status(200).json({
      message: "No AudioFile Found",
      status: "OK",
      statusCode: 200,
      data: null,
    });
  }

  if (!req.file) {
    res.status(200).json({
      message: "No File Uploaded",
      status: "OK",
      statusCode: 200,
      data: null,
    });
  }

  if (req.file) {
    req.body.audioFile = await uploadFileToSpace(req.file, "audioBooks");
  }

  const updatedAudioFile = await AudioFile.findByIdAndUpdate(
    audioFileId,
    req.body,
    {
      new: true,
    }
  ).lean();

  res.status(200).json({
    message: "Audio Updated",
    status: "OK",
    statusCode: 200,
    data: updatedAudioFile,
  });
});

//[🚧][🧑‍💻✅][🧪🆗] // 🚧 🧑‍💻✅  🧪🆗
const showAudioFilesForPreview = catchAsync(async (req, res) => {
  const { isPreview, audioBookId } = req.query;

  const isPreviewFilter =
    isPreview !== undefined ? { isPreview: isPreview === "true" } : {};

  const audioFiles = await AudioBook.findById(audioBookId)
    .select("audios storyTitle")
    .populate({
      path: "audios",
      match: isPreviewFilter,
      populate: {
        path: "languageId",
      },
    })
    .lean(); // Optional: Use .lean() to return plain JavaScript objects instead of Mongoose documents

  if (!audioFiles) {
    throw new Error("AudioBook not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Audio Files",
      status: "OK",
      statusCode: httpStatus.OK,
      data: audioFiles,
    })
  );
});

//[🚧][🧑‍💻][] // 🚧 🧑‍💻✅  🧪🆗
// Fix: Must korte hobe ImageUpload Update korte hobe .. digitalocean e
// INFO :  eta update kora lagbe na .. Manik vai eta niye kaj shuru korle bujha jabe
const editAudioBookPreview = catchAsync(async (req, res) => {
  const { audioBookId } = req.params; // Extract the audiobook ID from the URL parameters

  // Step 0: Validate the existence of the AudioBook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    // throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
    return res.status(httpStatus.NOT_FOUND).json(
      response({
        message: "AudioBook not found",
        status: "NOT_FOUND",
        statusCode: httpStatus.NOT_FOUND,
        data: null,
      })
    );
  }

  const audioFileIds = await AudioFile.find(
    {
      attachedTo: req.params.audioBookId,
    },
    { _id: 1 }
  );

  // Step 2: Process uploaded audio files
  const audioFileIDs = [];

  for (const audioFileId of audioFileIds) {
    audioFileIDs.push(audioFileId._id);
  }
  const updateData = {
    audios: audioFileIDs, // Update the `audios` field with the fetched audio file IDs
  };

  // Step 3: Update the audiobook document in the database
  const updatedAudioBook = await AudioBook.findByIdAndUpdate(
    audioBookId,
    { $set: updateData }, // Use `$set` to update only the specified fields
    { new: true } // Return the updated document
  ).populate("audios"); // Populate the `audios` field to include referenced AudioFile documents

  if (!updatedAudioBook) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update AudioBook"
    );
  }

  // Return success response
  res.status(200).json({
    message: "AudioBook Preview Updated Successfully",
    status: "OK",
    statusCode: 200,
    data: updatedAudioBook,
  });
});

const deleteAudioBookById = catchAsync(async (req, res) => {
  const { audioBookId } = req.params;

  // Step 1: Fetch the existing audiobook
  const audioBook = await AudioBook.findById(audioBookId);
  if (!audioBook) {
    throw new ApiError(httpStatus.NOT_FOUND, "AudioBook not found");
  }

  // Step 2: Delete associated cover photos from DigitalOcean Space
  if (audioBook.coverPhotos && audioBook.coverPhotos.length > 0) {
    for (const coverPhotoUrl of audioBook.coverPhotos) {
      try {
        // Extract the file key from the URL (if needed)
        await deleteFileFromSpace(coverPhotoUrl);
      } catch (error) {
        console.error("Failed to delete cover photo:", error.message);
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Failed to delete cover photo from DigitalOcean Space"
        );
      }
    }
  }

  // Step 3: Delete associated audio files from the database and DigitalOcean Space
  const audioFiles = await AudioFile.find({ attachedTo: audioBookId });

  for (const audioFile of audioFiles) {
    // Delete the audio file from DigitalOcean Space

    try {
      await deleteFileFromSpace(audioFile.audioFile);
      // Delete the audio file record from the database
      await AudioFile.findByIdAndDelete(audioFile._id);
    } catch (error) {
      // Error handling for file deletion or DB deletion failure
      console.error("Error during file deletion:", error);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete audio file"
      );
    }
  }

  // Step 4: Update the location count (if the audiobook is associated with a location)
  if (audioBook.locationId) {
    try {
      const location = await Location.findById(audioBook.locationId);
      console.log("🌀🌀🧑‍💻🟢🟢", location);

      if (location.count > 0) {
        await Location.findByIdAndUpdate(audioBook.locationId, {
          $inc: { count: -1 }, // Decrement the count by 1
        });

        //Step 5: Delete the audiobook document
        await AudioBook.findByIdAndDelete(audioBookId);
      }
    } catch (error) {
      console.error("Failed to update location count:", error.message);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update location count"
      );
    }
  }

  // // Step 5: Delete the audiobook document
  // await AudioBook.findByIdAndDelete(audioBookId);

  // Return success response
  res.status(httpStatus.OK).json({
    message: "AudioBook Deleted",
    status: "OK",
    statusCode: httpStatus.OK,
  });
});

module.exports = {
  createAudioBook,
  addAudioWithLanguageIdForAudioBook,
  getAllAudioBook,
  getAllAudioBookForAdmin,
  getAAudioBookById,
  updateAudioBookById,
  showAudioFilesForPreview,
  editAudioBookPreview,
  deleteAudioFile,
  deleteAudioBookById,
  updateAudioBookForPreviewById,
  updateAudioFileByAudioId,
};
