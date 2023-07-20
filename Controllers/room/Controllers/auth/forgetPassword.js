const db = require("../../models");
const validator = require('validator');
const nodemailer = require('nodemailer');
const config = require('../../config');
// const User = db.Users;
// const Walker = db.Walkers;
const User = db.Users;

const base64 = require("base-64");


exports.forgetPassword = async (req, res) => {

    try {
        const { email } = req.body;
        if (email === "") {
            throw ("Required email address.");
        } else if (!validator.isEmail(email)) {
            throw ("Invalid email address.");
        }

        const emailExists = await User.findOne({ where: { usr_email: email.toLowerCase() } });

        if (emailExists) {

            await User.update({ usr_otp: await generateOTP() }, { where: { usr_email: email.toLowerCase() } })
                .then(result => {
                  let EMAILL = email.toLowerCase()  

                   return sendOtpMail(EMAILL, res)
                    
                    // res.json({
                    //     status: true,
                    //     code: 200,
                    //     message: "Please check email for One Time Password."
                    // })
                })
                .catch(error => {
                    res.json({
                        status: false,
                        code: 401,
                        message: "something went wronge.",
                        origenalError: error
                    })
                })
        } else {
            res.json({
                status: false,
                code: 401,
                message: "email not exist."
            })

        }
    }
    catch (err) {
        res.json({
            status: false,
            code: 400,
            message: err
        })

    }
}

exports.verifyOtp = async (req, res) => {
    try {

        const { otp, email } = req.body

        const result = await User.findOne({ where: { usr_email: email.toLowerCase(), usr_otp: otp } });

        if (result) {
            res.json({
                status: true,
                code: 200,
                message: "OTP verified succesfully."
            })
        } else {
            res.json({
                status: false,
                code: 400,
                message: "Wrong OTP!."
            })
        }
    }
    catch (err) {
        res.json({
            status: false,
            code: 400,
            message: err
        })

    }
}

exports.updatePassword = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (email === "") {
            throw ("Required email address.");
        } else if (!validator.isEmail(email)) {
            throw ("Invalid email address.");
        } else if (!password) {
            throw ("Required password.")
        } else if (password.length < 8) {
            throw ("Required password must be 8 character or more.")
        }

        let encoded = await base64.encode(password);
        // const currentDate = new Date()

        const emailExists = await User.findOne({ where: { usr_email: email.toLowerCase() } });

        if (emailExists) {

            await User.update({
                usr_pasword: encoded
            }, { where: { usr_email: email.toLowerCase() } })
                .then((result) => {

                    // console.log("Password Updated.",  result)
                    res.json({
                        status: true,
                        code: 200,
                        message: "password successfully updated."
                    })
                })
                .catch((err) => {
                    console.log(">>>!!!!", err)
                    res.json({ status: false, code: 500, message: "Something went wronge.", err: err });
                });

        } else {
            res.json({
                status: false,
                code: 403,
                message: "Email not exists."
            })

        }

    }
    catch (err) {
        res.json({
            status: false,
            code: 400,
            message: err
        })

    }

}

const generateOTP = async () => {

    let digits = '9123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log("OTP>>>>", OTP)
    return OTP;
}

const sendOtpMail = async (UserEmail, res) => {

    const smtpTransport = require("nodemailer-smtp-transport");

    console.log(config.EMAIL_ADDRESS + "  " + config.EMAIL_PASSWORD)

    const emailExists = await User.findOne({ where: { usr_email: UserEmail } });

    var transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        auth: {
            user: config.EMAIL_ADDRESS,
            pass: config.EMAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: '<no-reply>@myRoom.com',
        to: UserEmail,
        subject: 'OTP from My Room',
        text: `This is you OTP to forget password - ${emailExists.usr_otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email send error", error);
            // return ('Email send Failed! Please try again.');
            res.json({
                status: false,
                code: 200,
                message: "'Email send Failed! Please try again.'."
            })
        }
        else {
            console.log('Email sent: ' + info.response);
           return res.json({
                status: true,
                code: 200,
                message: "Please check email for One Time Password."
            })

        }
    });
}