const express = require("express");
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const { Video } = require("../models/Video");
const { User } = require("../models/user");
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");
const { Comment } = require("../models/Comment");
const { Subscriber } = require("../models/Subscriber");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  //put your cloud name,api_key and api_secret here
  cloud_name: "test",
  api_key: "111111111",
  api_secret: "dummy_secret",
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

//=================================
//             User
//=================================

router.post("/uploadfiles", (req, res) => {
  // console.log(req);
  upload(req, res, async (err) => {
    // console.log(res.req.file);
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    } else {
      return res.json({
        success: true,
        filePath: res.req.file.path,
        fileName: res.req.file.name,
      });
    }
  });
});

router.put("/uploadThumbnail", (req, res) => {
  upload(req, res, async (err) => {
    // console.log(res.req.file);
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    } else {
      return res.json({
        success: true,
        filePath: res.req.file.path,
      });
    }
  });
});

router.put("/updateVideo", (req, res) => {
  console.log(req.body);
  if (req.body.changed) {
    cloudinary.uploader.upload(
      req.body.thumbnail,
      { folder: "thumbnail" },
      function (error, result1) {
        if (error) {
          console.log(error);
          return res.json({ success: false, error });
        } else {
          fs.unlinkSync(req.body.thumbnail);
          Video.findOne(
            { _id: req.body.videoId },
            { thumbnail_public: 1, _id: 0 }
          ).then((result) => {
            console.log(result);
            const public = result.thumbnail_public;
            console.log("here");
            console.log(public);
            const videoVariable = {
              title: req.body.title,
              description: req.body.description,
              category: req.body.cateogry,
              privacy: req.body.privacy,
              thumbnail: result1.url,
              thumbnail_public: result1.public_id,
            };
            Video.updateOne({ _id: req.body.videoId }, videoVariable)
              .then(() => {
                console.log("updated");
                cloudinary.uploader.destroy(public, function (err, result2) {
                  if (err) {
                    return res.json({ success: false, err });
                  } else {
                    return res.json({
                      success: true,
                      message: "Updated Video",
                    });
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      }
    );
  } else {
    const videoVariable = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.cateogry,
      privacy: req.body.privacy,
    };
    Video.updateOne({ _id: req.body.videoId }, videoVariable)
      .then(() => {
        return res.json({
          success: true,
          message: "Updated Video",
        });
      })
      .catch((err) => {
        return res.json({ success: false, err });
      });
  }
});

router.post("/thumbnail", (req, res) => {
  if (req.body.thumbnail != "") {
    fs.unlinkSync(req.body.thumbnail);
    fs.unlinkSync(req.body.videopath);
  }
  let thumbsFilePath = "";
  let fileDuration = "";
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on("filenames", function (filenames) {
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    .screenshots({
      count: 1,
      folder: "uploads/thumbnails",
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  video.save((err, video) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ success: false, err });
    }

    //savethumbnail to cloudinary
    cloudinary.uploader.upload(
      req.body.thumbnail,
      { folder: "thumbnail" },
      function (err, result) {
        if (err) {
          fs.unlinkSync(req.body.thumbnail);
          fs.unlinkSync(req.body.filePath);
          return res.json({ success: false, err });
        } else {
          Video.updateOne(
            { _id: video._id },
            { thumbnail: result.url, thumbnail_public: result.public_id }
          )
            .then(async () => {
              //save video to cloudinary
              await cloudinary.uploader.upload(
                req.body.filePath,
                {
                  folder: "videos",
                  resource_type: "video",
                  chunk_size: 6000000,
                  eager: [
                    {
                      width: 300,
                      height: 300,
                      crop: "pad",
                      audio_codec: "none",
                    },
                    {
                      width: 160,
                      height: 100,
                      crop: "crop",
                      gravity: "south",
                      audio_codec: "none",
                    },
                  ],
                  eager_async: true,
                  eager_notification_url:
                    "https://mysite.example.com/notify_endpoint",
                },
                function (err, result) {
                  if (err) {
                    console.log(err);
                    fs.unlinkSync(req.body.thumbnail);
                    fs.unlinkSync(req.body.filePath);
                    return res.json({ success: false, err });
                  } else {
                    // console.log(result);
                    Video.updateOne(
                      { _id: video._id },
                      { filePath: result.url, video_public: result.public_id }
                    )
                      .then(() => {
                        fs.unlinkSync(req.body.thumbnail);
                        fs.unlinkSync(req.body.filePath);
                        return res.status(200).json({
                          success: true,
                        });
                      })
                      .catch((err) => {
                        fs.unlinkSync(req.body.thumbnail);
                        fs.unlinkSync(req.body.filePath);
                        return res.status(400).json({ success: false, err });
                      });
                  }
                }
              );
            })
            .catch((err) => {
              fs.unlinkSync(req.body.thumbnail);
              fs.unlinkSync(req.body.filePath);
              return res.status(400).json({ success: false, err });
            });
        }
      }
    );
  });
});

//liked videos
router.post("/liked", (req, res) => {
  Like.find({ userId: req.body.profile })
    .populate({
      path: "videoId",
      populate: {
        path: "writer",
        model: "User",
      },
    })
    .then((videos) => {
      // console.log(videos);
      res.status(200).json({ success: true, liked: videos });
    })
    .catch((err) => {
      res.status(400).json({ success: false, msg: "Videos not find" });
    });
});


//landing page videos
router.post("/fetchlazyvideos",(req,res) => {
  // console.log(req.body);
  Video.find({})
  .skip(req.body.count).limit(10)
  .populate("writer")
  .exec((err,videos) => {
    if (err) return res.status(400).send(err);
    // console.log(videos);
    res.status(200).json({ success: true, videos });
  })
})

//get first 10 videos
router.post("/getlimitVideos", (req, res) => {
  Video.find({ _id: { $ne: req.body.currentvideo } })
    .limit(10)
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});


//side videos 
router.post("/getVideos", (req, res) => {
  Video.find({ _id: { $ne: req.body.currentvideo } })
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

//watching single video
router.post("/getVideo", (req, res) => {
  Video.findByIdAndUpdate({ _id: req.body.videoId }).exec((err, video) => {
    if (err) return res.status(400).send(err);
    else {
      video.views = video.views + 1;
      video.save();
    }
  });
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, video });
    });
});

router.get("/getTrendingVideos", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  Video.find()
    .sort({ views: -1 })
    .limit(4)
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/getSubscriptionVideos", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection

  Subscriber.find({ userFrom: req.body.profile }).exec((err, subscribers) => {
    if (err) return res.status(400).send(err);

    let subscribedUser = [];

    subscribers.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo);
    });

    //Need to Fetch all of the Videos that belong to the Users that I found in previous step.
    Video.find({ writer: { $in: subscribedUser } })
      .populate("writer")
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });
});

router.post("/deletevideo", async (req, res) => {
  // console.log(req.body.video);

  await Video.findById(req.body.video, function (err, video) {
    if (err) return res.status(400).send(err);
    // fs.unlinkSync(video.filePath);
    // fs.unlinkSync(video.thumbnail);
    Comment.deleteMany({ postId: video }, function (err) {
      if (err) return res.status(400).send(err);

      Like.deleteMany({ videoId: req.body.video }, function (err) {
        if (err) return res.status(400).send(err);

        Dislike.deleteMany({ videoId: req.body.video }, function (err) {
          if (err) return res.status(400).send(err);

          video.remove(function (err) {
            if (err) return res.status(400).json({ success: false, err });

            //delete thumbnail from Cloudinary
            cloudinary.uploader.destroy(
              video.thumbnail_public,
              function (err, result) {
                if (err) return res.status(400).json({ success: false, err });
                // return res.status(200).json({
                //   success: true,
                // });
                console.log(video.video_public);
                cloudinary.uploader.destroy(
                  video.video_public,
                  {
                    resource_type: "video",
                  },
                  function (err, result) {
                    if (err)
                      return res.status(400).json({ success: false, err });
                    console.log(result);
                    return res.status(200).json({
                      success: true,
                    });
                  }
                );
              }
            );
          });
        });
      });
    });
  });
});

//get videos in profile
router.post("/getuservideos", (req, res) => {
  Video.find({ writer: req.body.profile })
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      // console.log(videos);
      res.status(200).json({ success: true, videos });
    });
});

//get saved videos
router.post("/saved", (req, res) => {
  User.find({ _id: req.body.profile }).then((user) => {
    Video.find({ _id: { $in: user[0].saved } })
      .populate("writer")
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  });
});

//save videos
router.post("/savevideo", (req, res) => {
  User.updateOne(
    { _id: req.body._id },
    { $addToSet: { saved: [req.body.video] } }
  )
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(() => {
      return res.status(400).send(err);
    });
});

//unsave videos
router.post("/unsavevideo", (req, res) => {
  User.updateOne({ _id: req.body._id }, { $pull: { saved: req.body.video } })
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(() => {
      return res.status(400).send(err);
    });
});

module.exports = router;
