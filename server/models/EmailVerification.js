const mongoose = require("mongoose");

const emailSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },

    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const EmailVerification = mongoose.model("EmailVerification", emailSchema);

module.exports = { EmailVerification };
