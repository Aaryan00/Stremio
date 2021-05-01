const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    videos: {
      type: Array,
    },
    thumbnail: {
      type: String,
      default: " http://localhost:5000/uploads/thumbnails/download.png",
    },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = { Playlist };
