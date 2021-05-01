const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    video_public: {
      type: String,
      default: "",
    },
    catogory: String,
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    thumbnail_public: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
