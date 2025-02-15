const mongoose = require("mongoose");

const listeningHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    audioFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AudioFile", 
      required: true,
    },
    progress: {
      type: Number, // Time in seconds of how much was listened
      default: 0,
    },
    completed: {
      type: Boolean, // Whether the user has fully listened to the audio
      default: false,
    },
    lastListenedAt: {
      type: Date, // Timestamp of the last listening activity
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const ListeningHistory = mongoose.model("ListeningHistory", listeningHistorySchema, "listeningHistories");
module.exports = ListeningHistory;