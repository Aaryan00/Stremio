const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },

    otp: {
      type: Number,
    },
    expire_at: {
      type: Date,
      default: Date.now,
      expires: -100,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = { Otp };
