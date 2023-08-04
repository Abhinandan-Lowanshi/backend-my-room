const validator = require("validator");
const base64 = require("base-64");
const db = require("../../models");
const { temp } = require("../../models");
const config = require("../../config");
const nodemailer = require("nodemailer");
const jwtHelper = require("../../helper/jwthelper");
const User = db.Users;
const upload = require("../../services/multer");

exports.sendVerifyMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (email === "") {
      throw "Required email address.";
    } else if (!validator.isEmail(email)) {
      throw "Invalid email address.";
    }

    const emailExists = await User.findOne({
      where: { usr_email: email.toLowerCase() },
    });

    if (!emailExists) {
      // await User.update({ usr_otp: await generateOTP() }, { where: { usr_email: email.toLowerCase() } })
      const otp = await generateOTP();
      await temp
        .create({ emailOTP: otp, email: email })
        .then((result) => {
          let EMAILL = email.toLowerCase();

          return sendOtpMail(EMAILL, otp, res);

          // res.json({
          //     status: true,
          //     code: 200,
          //     message: "Please check email for One Time Password."
          // })
        })
        .catch((error) => {
          res.json({
            status: false,
            code: 401,
            message: "something went wronge.",
            origenalError: error,
          });
        });
    } else {
      res.json({
        status: false,
        code: 401,
        message: "Email already exist.",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      code: 400,
      message: err,
    });
  }
};

exports.EmailVerifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const result = await temp.findOne({
      where: { email: email.toLowerCase(), emailOTP: otp },
    });

    if (result) {
      res.json({
        status: true,
        code: 200,
        message: "OTP verified succesfully.",
      });
    } else {
      res.json({
        status: false,
        code: 400,
        message: "Wrong OTP!.",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      code: 400,
      message: err,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      currentAdrs,
      prmntAddress,
      password,
      device_token,
    } = req.body;

    if (!firstName) {
      throw "Required first name.";
      // } else if (!lastName) {
      //     throw ("Required last name.")
    } else if (email === "") {
      throw "Required email address.";
    } else if (!validator.isEmail(email)) {
      throw "Invalid email address.";
    } else if (!password) {
      throw "Required password.";
    } else if (password.length < 8) {
      throw "Required password must be 8 character or more.";
    } else if (!phone) {
      throw "Required phone number.";
    } else if (!currentAdrs) {
      throw "Required Current address.";
    } else if (!prmntAddress) {
      throw "Required permanent address.";
    }

    let encoded = await base64.encode(password);
    const reqData = {
      usr_firstName: firstName,
      usr_lastName: lastName,
      usr_email: email.toLowerCase(),
      usr_phone: phone,
      usr_parmentAdrss: prmntAddress,
      usr_currentAdrss: currentAdrs,
      usr_pasword: encoded,
      device_token,
    };

    const emailExists = await User.findOne({
      where: { usr_email: email.toLowerCase() },
    });

    if (emailExists) {
      res.json({
        status: false,
        message: "Email already registered.",
        data: {},
      });
    } else {
      User.create(reqData)
        .then(async (result) => {
          await temp.destroy({ where: { email: email } });
          const token = await jwtHelper.signAccessToken({
            email: email,
            userId: result.usr_pkey,
          });
          res.json({
            status: true,
            message: "Register successfully.",
            token,
            data: {
              usr_id: result.usr_pkey,
              usr_firstName: result.usr_firstName,
              usr_lastName: result.usr_lastName,
              usr_email: result.usr_email,
              usr_phone: result.usr_phone,
              usr_parmentAdrss: result.usr_parmentAdrss,
              usr_currentAdrss: result.usr_currentAdrss,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: true,
            message: "Something went wronge.",
            data: {},
            orignalError: err,
          });
        });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Something went wronge.",
      data: {},
      orignalError: err,
    });
  }
};

const generateOTP = async () => {
  let digits = "9123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log("OTP>>>>", OTP);
  return OTP;
};

const sendOtpMail = async (UserEmail, otp, res) => {
  const smtpTransport = require("nodemailer-smtp-transport");

  console.log(config.EMAIL_ADDRESS + "  " + config.EMAIL_PASSWORD);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.EMAIL_ADDRESS,
      pass: config.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: "<no-reply>@myRoom.com",
    to: UserEmail,
    subject: "OTP from My Room",
    text: `This is you OTP to verify email - ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Email send error", error);
      // return ('Email send Failed! Please try again.');
      res.json({
        status: false,
        code: 200,
        message: "'Email send Failed! Please try again.'.",
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.json({
        status: true,
        code: 200,
        message: "Please check email for One Time Password.",
      });
    }
  });
};
