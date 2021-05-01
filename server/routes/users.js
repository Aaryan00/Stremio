const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { EmailVerification } = require("../models/EmailVerification");
const { Otp } = require("../models/OTP");
const { auth } = require("../middleware/auth");
const { sendEmail } = require("../Nodemailer/mail");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const uuid = require("uuid");
const path = require("path");

cloudinary.config({
  //put your cloud name,api_key and api_secret here
  cloud_name: "test",
  api_key: "111111111",
  api_secret: "dummy_secret",
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.put("/changeprofile/:mainuser", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    } else {
      const path = res.req.file.path;
      console.log(path);
      User.findOne({ _id: req.params.mainuser })
        .then((user) => {
          if (user.public_id !== "") {
            // Deleting old user photo to save storage
            cloudinary.uploader.destroy(user.public_id, function (err, result) {
              if (err) {
                fs.unlinkSync(path);
                return res.json({ success: false, err });
              } else {
                console.log("here");
              }
            });
          }
        })
        .catch((err) => {
          fs.unlinkSync(path);
          return res.json({ success: false, err });
        });

      //Save new photo
      cloudinary.uploader.upload(
        path,
        { folder: "Users" },
        function (error, result) {
          if (error) {
            return res.json({ success: false, err });
          } else {
            // console.log(result);
            User.updateOne(
              { _id: req.params.mainuser },
              { image: result.url, public_id: result.public_id }
            )
              .then(() => {
                fs.unlinkSync(path);
                return res.json({
                  success: true,
                });
              })
              .catch((err) => {
                fs.unlinkSync(path);
                return res.json({ success: false, err });
              });
          }
        }
      );
    }
  });
});

router.post("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);
  const verifytoken = uuid.v4();

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    else {
      sendEmail(req.body.email, req.body.name, "welcome");
      const emailverify = new EmailVerification({
        email: req.body.email,
        token: verifytoken,
      });
      emailverify
        .save()
        .then(() => {
          sendEmail(req.body.email, verifytoken, "emailverify");
          return res.status(200).json({
            success: true,
          });
        })
        .catch((err) => {
          return res.json({ success: false });
        });
    }
  });
});

router.post("/resendemailverification", (req, res) => {
  EmailVerification.findOne({ email: req.body.email })
    .then((email) => {
      sendEmail(req.body.email, email.token, "emailverify");
      return res.json({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false });
    });
});

router.post("/profileChange", (req, res) => {
  User.findOne({ _id: req.body.id }, (err, user) => {
    if (user) {
      user.image = req.body.url;
      user.save();
      res.status(200).json({ success: true });
    }
  });
});

// router.post("/googlesignup", (req, res) => {
//   User.findOne({ email: req.body.email }, (err, user) => {
//     if (user) {
//       return res.json({ success: false });
//     } else {
//       const newuser = new User(req.body);

//       newuser.save((err, doc) => {
//         if (err) return res.json({ success: false });
//         else {
//           sendEmail(req.body.email, req.body.name, "welcome");
//           User.updateOne({ email: req.body.email }, { verified: 1 })
//             .then(() => {
//               return res.status(200).json({
//                 success: true,
//               });
//             })
//             .catch((err) => {
//               return res.json({ success: false });
//             });
//         }
//       });
//     }
//   });
// });

// router.post("/googlesignin", (req, res) => {
//   User.findOne({ email: req.body.email }, (err, user) => {
//     if (user) {
//       user.generateToken((err, user) => {
//         if (err) return res.status(400).send(err);
//         res.cookie("w_authExp", user.tokenExp);
//         res.cookie("w_auth", user.token).status(200).json({
//           success: true,
//           w_auth: user.token,
//           userId: user._id,
//         });
//       });
//     } else {
//       console.log(err);
//       return res.json({ success: false });
//     }
//   });
// });

router.post("/googlelogin", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          success: true,
          w_auth: user.token,
          userId: user._id,
        });
      });
    } else {
      const newuser = new User(req.body);

      newuser.save((err, doc) => {
        if (err) return res.json({ success: false });
        else {
          sendEmail(req.body.email, req.body.name, "welcome");
          User.updateOne({ email: req.body.email }, { verified: 1 })
            .then(() => {
              User.findOne({ email: req.body.email }, (err, user) => {
                user.generateToken((err, user) => {
                  if (err) return res.status(400).send(err);
                  res.cookie("w_authExp", user.tokenExp);
                  res.cookie("w_auth", user.token).status(200).json({
                    success: true,
                    w_auth: user.token,
                    userId: user._id,
                  });
                });
              });
            })
            .catch((err) => {
              return res.json({ success: false });
            });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
        code: 201,
      });
    else if (user.verified === 0)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, User not verified",
        code: 202,
      });
    else {
      if (user.password) {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
            return res.json({
              loginSuccess: false,
              message: "Wrong password",
              code: 203,
            });

          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("w_authExp", user.tokenExp);
            res.cookie("w_auth", user.token).status(200).json({
              w_auth: user.token,
              loginSuccess: true,
              userId: user._id,
              message: "Login Success",
              code: 200,
            });
          });
        });
      } else {
        return res.json({
          loginSuccess: false,
          message: "Email registered with google",
          code: 204,
        });
      }
    }
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.get("/:token", async (req, res) => {
  console.log(req.params.token);
  await EmailVerification.findOne({ token: req.params.token })
    .then(async (email) => {
      console.log(email);
      await User.updateOne({ email: email.email }, { verified: 1 })
        .then(async () => {
          await EmailVerification.deleteOne({ token: req.params.token })
            .then(() => {
              console.log("here in verification");
              res.sendFile(path.resolve(__dirname, "resume.html"));
            })
            .catch((err) => {
              console.log(err);
              res.json({
                message: "Your Token has Expired 1, Please create new Token",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: "Your Token has Expired 2, Please create new Token",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "Your Token has Expired 3, Please create new Token",
      });
    });
});

router.post("/forgot", (req, res) => {
  User.findOne({ email: req.body.email.trim() }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(200).json({ success: false });
    else {
      console.log("found!");
      return res.status(200).json({ success: true });
    }
  });
});

router.post("/storeotp", (req, res) => {
  Otp.findOneAndDelete({ email: req.body.email.trim() }, function (err, docs) {
    if (err) {
      console.log(err);
    }
  });
  const otp = new Otp(req.body);

  otp.save((err, otp) => {
    if (err) {
      console.log("bhai kux error aai");
      console.log(err);
      return res.status(400).send(err);
    } else {
      sendEmail(req.body.email, req.body.otp, "otpchange");

      return res.status(200).json({
        success: true,
      });
    }
  });
});

router.post("/otp", (req, res) => {
  Otp.findOne({ email: req.body.email.trim() }).exec((err, result) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      if (result.otp == req.body.otp)
        return res.status(200).json({ success: true });
      else {
        return res.status(200).json({ success: false });
      }
    }
  });
});

router.post("/changed", (req, res) => {
  User.findOneAndUpdate(
    { email: req.body.email.trim() },
    { password: req.body.password },
    null,
    function (err, result) {
      if (err) {
        return res.status(400).send(err);
      } else {
        result.password = req.body.password;
        result.save();
        return res.status(200).json({ success: true });
      }
    }
  );
});

router.post("/getdata", (req, res) => {
  User.find({ _id: req.body.profile }).exec((err, user) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).json({
        success: true,
        user,
      });
    }
  });
});

module.exports = router;
