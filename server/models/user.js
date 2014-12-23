// Generated by CoffeeScript 1.8.0
(function() {
  var bcrypt, crypto, mongoose, nthash, password, secrets, stripeCustomer, stripeOptions, timestamps, userSchema;

  mongoose = require("mongoose");

  password = require("mongoose");

  nthash = require('smbhash').nthash;

  bcrypt = require("bcrypt-nodejs");

  crypto = require("crypto");

  stripeCustomer = require("./plugins/stripe-customer");

  secrets = require("../config/secrets");

  timestamps = require("mongoose-timestamp");

  userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: String,
    coupon: String,
    pendingPayment: String,
    expiration: Date,
    billingType: String,
    isStaff: String,
    username: {
      type: String,
      unique: true,
      lowercase: true
    },
    profile: {
      name: {
        type: String,
        "default": ""
      },
      gender: {
        type: String,
        "default": ""
      },
      location: {
        type: String,
        "default": ""
      },
      website: {
        type: String,
        "default": ""
      },
      picture: {
        type: String,
        "default": ""
      }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  });

  stripeOptions = secrets.stripeOptions;

  userSchema.plugin(timestamps);

  userSchema.plugin(stripeCustomer, stripeOptions);

  userSchema.pre("save", function(next) {
    var user;
    user = this;
    if (!user.isModified("password")) {
      return next();
    }
    user.password = nthash(user.password);
    return next();
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    if (this.password !== nthash(candidatePassword)) {
      return cb(true, null);
    }
    return cb(null, true);
  };

  userSchema.methods.gravatar = function(size) {
    var md5;
    if (!size) {
      size = 200;
    }
    if (!this.email) {
      return "https://gravatar.com/avatar/?s=" + size + "&d=retro";
    }
    md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
  };

  module.exports = mongoose.model("User", userSchema);

}).call(this);
