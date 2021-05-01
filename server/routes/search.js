const express = require("express");
const router = express.Router();

const { Video } = require("../models/Video");
const { User } = require("../models/user");
const { Playlist } = require("../models/Playlist");
const { auth } = require("../middleware/auth");

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

router.post("/results/videos", async (req, res) => {
  var query1 = ".*" + req.body.query + "*.";
  var x = req.body.query.split(" ");
  let result1 = [];
  var flag = 0;
  for (var k = 0; k < x.length; ) {
    if (x[k].length <= 2) {
      x.splice(k, 1);
    } else {
      k++;
    }
  }
  // console.log("here");
  await Video.find(
    {
      $or: [{ title: { $regex: query1 } }, { description: { $regex: query1 } }],
    },
    { _id: 1 },
    async function (err, result) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        // console.log("herealso");
        await result.forEach((ids) => {
          // console.log(result1.indexOf(String(ids._id)));
          result1.push(String(ids._id));
        });
      }
    }
  );
  for (var i = 0; i < x.length; i++) {
    flag = 0;
    var query1 = ".*" + x[i] + "*.";
    // console.log(query1);
    await Video.find(
      {
        $or: [
          { title: { $regex: query1 } },
          { description: { $regex: query1 } },
        ],
      },
      { _id: 1 },
      async function (err, result) {
        flag = 1;
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else {
          // console.log(result);
          await result.forEach((ids) => {
            // console.log(result1.indexOf(String(ids._id)));
            if (result1.indexOf(String(ids._id)) === -1) {
              result1.push(String(ids._id));
            }
          });
        }
      }
    );
    console.log("");
    //console.log(result1);
    console.log(i, x.length - 1, flag);
    let finalRes = [];
    if (i === x.length - 1 && flag === 1) {
      // console.log("final:");
      console.log(result1);
      for (var j = 0; j < result1.length; j++) {
        await Video.findOne({ _id: result1[j] })
          .populate("writer")
          .then(async (result) => {
            console.log("");
            finalRes.push(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      res.json({ success: true, result: finalRes });
    }
  }
  // const newArray = [...new Set(result1)];
  // console.log(newArray);
});
router.post("/results/playlists", async (req, res) => {
  var query1 = ".*" + req.body.query + "*.";
  var x = req.body.query.split(" ");
  let result1 = [];
  var flag = 0;
  for (var k = 0; k < x.length; ) {
    if (x[k].length <= 2) {
      x.splice(k, 1);
    } else {
      k++;
    }
  }
  // console.log("here");
  await Playlist.find(
    { title: { $regex: query1 } },
    { _id: 1 },
    async function (err, result) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        // console.log("herealso");
        await result.forEach((ids) => {
          // console.log(result1.indexOf(String(ids._id)));
          result1.push(String(ids._id));
        });
      }
    }
  );
  for (var i = 0; i < x.length; i++) {
    flag = 0;
    var query1 = ".*" + x[i] + "*.";
    // console.log(query1);
    await Playlist.find(
      { title: { $regex: query1 } },
      { _id: 1 },
      async function (err, result) {
        flag = 1;
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else {
          await result.forEach((ids) => {
            // console.log(result1.indexOf(String(ids._id)));
            if (result1.indexOf(String(ids._id)) === -1) {
              result1.push(String(ids._id));
            }
          });
        }
      }
    );
    console.log("");

    // console.log("here4");
    // console.log(result1);
    console.log(i, x.length - 1, flag);
    if (i === x.length - 1 && flag === 1) {
      // console.log("final:");
      let finalRes = [];

      console.log(result1);
      for (var j = 0; j < result1.length; j++) {
        await Playlist.findOne({ _id: result1[j] })
          .populate("user_id")
          .then(async (result) => {
            console.log("");
            finalRes.push(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      res.json({ success: true, result: finalRes });
    }
  }
});
router.post("/results/users", async (req, res) => {
  var query1 = ".*" + req.body.query + "*.";
  var x = req.body.query.split(" ");
  let result1 = [];
  var flag = 0;
  for (var k = 0; k < x.length; ) {
    if (x[k].length <= 2) {
      x.splice(k, 1);
    } else {
      k++;
    }
  }
  // console.log("here");
  await User.find(
    { name: { $regex: query1 } },
    { _id: 1 },
    async function (err, result) {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        // console.log("herealso");
        await result.forEach((ids) => {
          // console.log(result1.indexOf(String(ids._id)));
          result1.push(String(ids._id));
        });
      }
    }
  );
  for (var i = 0; i < x.length; i++) {
    flag = 0;
    var query1 = ".*" + x[i] + "*.";
    // console.log(query1);
    await User.find(
      { name: { $regex: query1 } },
      { _id: 1 },
      async function (err, result) {
        flag = 1;
        if (err) {
          console.log(err);
          res.json({ success: false });
        } else {
          await result.forEach((ids) => {
            // console.log(result1.indexOf(String(ids._id)));
            if (result1.indexOf(String(ids._id)) === -1) {
              result1.push(String(ids._id));
            }
          });
        }
      }
    );
    // console.log("here4");
    // console.log(result1);
    console.log(i, x.length - 1, flag);
    if (i === x.length - 1 && flag === 1) {
      // console.log("final:");
      console.log(result1);
      let finalRes = [];
      for (var j = 0; j < result1.length; j++) {
        await User.findOne({ _id: result1[j] }, async function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log("");
            finalRes.push(result);
            if (finalRes.length === result1.length) {
              res.json({ success: true, result: finalRes });
            }
          }
        });
      }
    }
  }
});
module.exports = router;
