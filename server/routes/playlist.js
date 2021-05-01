const express = require("express");
const router = express.Router();

const { Playlist } = require("../models/Playlist");
const { Video } = require("../models/Video");

router.post("/createplaylist", (req, res) => {
  const playlist = new Playlist(req.body);

  playlist
    .save()
    .then(() => {
      res.status(200).json({ success: true, msg: "Playlist created" });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: "Playlist not created" });
    });
});

router.post("/getplaylist", (req, res) => {
  Playlist.find({ user_id: req.body.profile })
    .populate("user_id")
    .then((playlist) => {
      res.status(200).json({ success: true, playlist });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: "Playlist not find" });
    });
});

//get videos inside playlist
router.get("/:playlist", (req, res) => {
  Playlist.find({ _id: req.params.playlist })
    .then((playlist) => {
      Video.find({ _id: { $in: playlist[0].videos } })
        .populate("writer")
        .then((videos) => {
          const result = {
            playlist: playlist,
            videos: videos,
          };
          res.status(200).json({ success: true, result });
        })
        .catch(() => {
          res.status(400).json({ success: false, msg: "videos not find" });
        });
    })
    .catch(() => {
      res.status(400).json({ success: false, msg: "Playlist not find" });
    });
});

//delete playlist
router.post("/deleteplaylist", (req, res) => {
  Playlist.deleteOne({ _id: req.body.playlist }, function (err) {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//add new videos and change thumbnails
router.post("/addvideos", (req, res) => {
  Playlist.updateOne(
    { _id: req.body.playlistid },
    { $push: { videos: req.body.videos } }
  )
    .then(() => {
      Playlist.find({ _id: req.body.playlistid })
        .then((playlist) => {
          console.log(playlist);
          if (playlist[0].videos.length > 0) {
            //finding video of 0th index
            Video.find({ _id: playlist[0].videos[0] })
              .then((video) => {
                const videothumbnail = video[0].thumbnail;

                //thumbnail of playlist will be 0thindex video thumbnail
                Playlist.updateOne(
                  { _id: req.body.playlistid },
                  { thumbnail: videothumbnail }
                )
                  .then(() => {
                    return res.status(200).json({ success: true });
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(400)
                      .json({ success: false, msg: "thumbnail not updated" });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({ success: false, msg: "Video not find" });
              });
          } else {
            Playlist.updateOne(
              { _id: req.body.playlistid },
              { thumbnail: "uploads/thumbnails/download.png" }
            )
              .then(() => {
                return res.status(200).json({ success: true });
              })
              .catch(() => {
                res
                  .status(400)
                  .json({ success: false, msg: "thumbnail not updated" });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ success: false, msg: "Playlist not find" });
        });
    })
    .catch(() => {
      res.status(400).json({ success: false, msg: "Playlist not updated" });
    });
});

//delete video inside playlist and update the thumbnail
router.post("/deleteplaylistvideo", (req, res) => {
  Playlist.updateOne(
    { _id: req.body.playlist },
    { $pull: { videos: req.body.video } } //removing video from playlist
  )
    .then(() => {
      Playlist.find({ _id: req.body.playlist }).then((playlist) => {
        if (playlist[0].videos.length > 0) {
          //finding video of 0th index
          Video.find({ _id: playlist[0].videos[0] })
            .then((video) => {
              const videothumbnail = video[0].thumbnail;

              //thumbnail of playlist will be 0thindex video thumbnail
              Playlist.updateOne(
                { _id: req.body.playlist },
                { thumbnail: videothumbnail }
              )
                .then(() => {
                  return res.status(200).json({ success: true });
                })
                .catch(() => {
                  res
                    .status(400)
                    .json({ success: false, msg: "thumbnail not updated" });
                });
            })
            .catch(() => {
              res.status(400).json({ success: false, msg: "Video not find" });
            });
        } else {
          Playlist.updateOne(
            { _id: req.body.playlist },
            { thumbnail: "uploads/thumbnails/download.png" }
          )
            .then(() => {
              return res.status(200).json({ success: true });
            })
            .catch(() => {
              res
                .status(400)
                .json({ success: false, msg: "thumbnail not updated" });
            });
        }
      });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: "Playlist not updated" });
    });
});

router.put("/title", function (req, res) {
  console.log(req.body);
  Playlist.updateOne({ _id: req.body.playlistId }, { title: req.body.newTitle })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

module.exports = router;
