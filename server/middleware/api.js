// Generated by CoffeeScript 1.8.0
(function() {
  var User, mailgunApiTransport, nodemailer, restify, secrets;

  secrets = require("../config/secrets");

  restify = require("restify");

  nodemailer = require("nodemailer");

  mailgunApiTransport = require("nodemailer-mailgunapi-transport");

  User = require("../models/user");

  exports.activate = function(customerId, plan, billingType, callback) {
    return User.findOne({
      "stripe.customerId": customerId
    }, function(err, user) {
      var client, expiration, t;
      if (err) {
        return callback(err, false);
      }
      if (!user) {
        return callback(false, true);
      } else {
        if (plan === "yearly") {
          t = moment().add(1, "years");
        } else {
          t = moment().add(1, "months");
        }
        expiration = t.format("DD MMM YYYY HH:mm:ss");
        client = restify.createStringClient({
          url: secrets.vpnht.url
        });
        client.basicAuth(secrets.vpnht.key, secrets.vpnht.secret);
        return client.put("/activate/" + user.username, {
          expiration: expiration
        }, function(err, req2, res2, obj) {
          var mailOptions, transporter;
          if (err) {
            return callback(err, false);
          }
          transporter = nodemailer.createTransport(mailgunApiTransport({
            apiKey: secrets.mailgun.password,
            domain: secrets.mailgun.user
          }));
          mailOptions = {
            to: user.email,
            from: "noreply@vpn.ht",
            subject: "VPN Account enabled",
            text: "You are receiving this email because your account has been activated till " + expiration + ".\n" + "You can read the documentation how to get started on:\n\n" + "https://vpn.ht/documentation\n\n" + "If you need help, feel free to contact us at support@vpn.ht.\n"
          };
          return transporter.sendMail(mailOptions, function(err) {
            if (err) {
              return callback(err, false);
            }
            user.stripe.plan = plan;
            user.billingType = billingType;
            return user.save(function(err) {
              if (err) {
                return callback(err, false);
              }
              console.log("user: " + user.username + " subscription was successfully updated and expire on " + expiration);
              return callback(false, true);
            });
          });
        });
      }
    });
  };

}).call(this);
