secrets = require("../config/secrets")
restify = require("restify")
nodemailer = require("nodemailer")
mailgunApiTransport = require("nodemailer-mailgunapi-transport")
User = require("../models/user")
moment = require("moment")

exports.remove = (customerId, callback) ->
    User.findOne
        "stripe.customerId": customerId,
        (err, user) ->

            return callback(err, false) if err

            unless user
                # user does not exist, no need to process
                return callback(false, true)
            else
                user.stripe.plan = 'free'
                user.expiration = new Date()

                user.save (err) ->
                    return callback(err, false) if err
                    # ok alls good...
                    console.log "user: " + user.username + " subscription was successfully cancelled"
                    return callback(false, true)

exports.activate = (customerId, plan, billingType, callback) ->
    User.findOne
        "stripe.customerId": customerId,
        (err, user) ->

            return callback(err, false) if err

            unless user
                # user does not exist, no need to process
                return callback(false, true)
            else

                # create our expiration
                if plan is "lifely"
                    t = moment().add(100, "years")
                else if plan is "yearly"
                    t = moment().add(1, "years")
                else if plan is "weekly"
                    t = moment().add(1, "weeks")
                else t = moment().add(1, "months")
                expiration = t.format("DD MMM YYYY HH:mm:ss")

                # build our api client
                client = restify.createStringClient(url: secrets.vpnht.url)
                client.basicAuth secrets.vpnht.key, secrets.vpnht.secret
                client.put "/activate/" + user.username,
                    expiration: expiration
                , (err, req2, res2, obj) ->
                    return callback(err, false) if err

                    # ok we can send the welcome email
                    transporter = nodemailer.createTransport(mailgunApiTransport(
                        apiKey: secrets.mailgun.password
                        domain: secrets.mailgun.user
                    ))

                    mailOptions =
                        to: user.email
                        from: "noreply@vpn.ht"
                        subject: "VPN Account enabled"
                        text: "You are receiving this email because your account has been activated and expire " + expiration + ".\n" +
                            "You can read the documentation how to get started on:\n\n" +
                            "https://vpn.ht/documentation\n\n" +
                            "If you need help, feel free to contact us at support@vpn.ht.\n"

                    transporter.sendMail mailOptions, (err) ->
                        return callback(err, false) if err

                        user.pendingPayment = '';
                        user.stripe.plan = plan
                        user.billingType = billingType
                        user.expiration = t.toDate()

                        user.save (err) ->
                            return callback(err, false) if err
                            # ok alls good...
                            console.log "user: " + user.username + " subscription was successfully updated and expire on " + expiration
                            return callback(false, true)
