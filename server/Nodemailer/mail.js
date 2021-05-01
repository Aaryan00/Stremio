const mailer = require("nodemailer");
const { Otpchange } = require("./passwordotp");
const { Welcome } = require("./welcome");
const { EmailVerification } = require("./emailVerification");

const getEmailData = (to, otp, template) => {
  let data = null;

  switch (template) {
    case "otpchange":
      data = {
        from: "Stremio <jaewon@gmail.com>",
        to,
        subject: "Otp for password change",
        html: Otpchange(otp),
      };
      break;

    case "welcome":
      data = {
        from: "Stremio <jaewon@gmail.com>",
        to,
        subject: `Stremio, Stream for all purposes`,
        html: Welcome(otp),
      };
      break;

    case "emailverify":
      data = {
        from: "Stremio <jaewon@gmail.com>",
        to,
        subject: `Stremio, Stream for all purposes`,
        html: EmailVerification(otp),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendEmail = (to, name, type) => {
  const smtpTransport = mailer.createTransport({
    port: 535,
    secure: false,
    service: "Gmail",
    auth: {
      //use your email id and password/hashkey
      user: "user@gmail.com",
      pass: "pass",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mail = getEmailData(to, name, type);

  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log("email not sent");
      console.log(error);
    } else {
      console.log(" email sent successfully");
    }
    smtpTransport.close();
  });
};

module.exports = { sendEmail };
