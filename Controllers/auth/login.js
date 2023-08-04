const validator = require("validator");
const base64 = require("base-64");
const db = require("../../models");
const jwtHelper = require("../../helper/jwthelper");
const User = db.Users;

exports.login = async (req, res) => {
  try {
    const { email, password, device_token } = req.body;

    if (email === "" || email === undefined || email === null) {
      throw "Required email address.";
    } else if (!validator.isEmail(email)) {
      throw "Invalid email address.";
    } else if (!password || password === undefined || password === null) {
      throw "Required password.";
    }

    const emailExists = await User.findOne({
      where: { usr_email: email.toLowerCase() },
    });

    if (emailExists) {
      const userpassword = base64.decode(emailExists.dataValues.usr_pasword);

      if (userpassword === password) {
        if (device_token) {
          await User.update(
            { device_token: device_token },
            { where: { usr_email: email.toLowerCase() } }
          );
        }
        const token = await jwtHelper.signAccessToken({
          email: email,
          userId: emailExists.usr_pkey,
        });
        res.json({
          status: true,
          message: "Login successfully.",
          token,
          data: {
            usr_id: emailExists.dataValues.usr_pkey,
            usr_firstName: emailExists.dataValues.usr_firstName,
            usr_lastName: emailExists.dataValues.usr_lastName,
            usr_email: emailExists.dataValues.usr_email,
            usr_phone: emailExists.dataValues.usr_phone,
            usr_parmentAdrss: emailExists.dataValues.usr_parmentAdrss,
            usr_currentAdrss: emailExists.dataValues.usr_currentAdrss,
          },
        });
      } else {
        res.json({
          status: false,
          message: "Invalid Email address or password.",
          data: {},
        });
      }
    } else {
      res.json({
        status: false,
        code: 400,
        message: "Invalid Email address or password.",
        data: {},
      });
    }
  } catch (err) {
    console.log("err", err);
    res.json({
      status: false,
      message: "Something went wronge.",
      data: {},
      orignalError: err,
    });
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const { email, name, device_token, social_token } = req.body;

    if (
      email === "" ||
      email === undefined ||
      email === null ||
      device_token === "" ||
      device_token === undefined ||
      device_token === null ||
      social_token === "" ||
      social_token === undefined ||
      social_token === null
    ) {
      throw "Something went wrong";
    }

    const emailExists = await User.findOne({
      where: { usr_email: email.toLowerCase() },
    });
    console.log(emailExists);
    if (emailExists) {
      const token = await jwtHelper.signAccessToken({
        email: email,
        userId: emailExists.dataValues.usr_pkey,
      });
      res.json({
        status: true,
        message: "Login successfully.",
        token,
        data: {
          usr_id: emailExists.dataValues.usr_pkey,
          usr_firstName: emailExists.dataValues.usr_firstName,
          usr_lastName: emailExists.dataValues.usr_lastName,
          usr_email: emailExists.dataValues.usr_email,
          usr_phone: emailExists.dataValues.usr_phone,
          usr_parmentAdrss: emailExists.dataValues.usr_parmentAdrss,
          usr_currentAdrss: emailExists.dataValues.usr_currentAdrss,
          loginType: emailExists.dataValues.loginType,
        },
      });
    } else {
      const reqData = {
        usr_firstName: name,
        usr_lastName: "nill",
        usr_email: email.toLowerCase(),
        usr_phone: "",
        usr_parmentAdrss: "",
        usr_currentAdrss: "",
        usr_pasword: "",
        device_token,
        loginType: "google",
        social_token: social_token,
      };
      User.create(reqData)
        .then(async (result) => {
          const token = await jwtHelper.signAccessToken({
            email: email,
            userId: result.usr_pkey,
          });
          console.log(result, "result");
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
              loginType: result.loginType,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: true,
            message: "Something went lll.",
            data: {},
            // orignalError: err,
          });
        });
    }
  } catch (err) {
    console.log("err", err);
    res.json({
      status: false,
      message: "Something went hhh.",
      data: {},
      // orignalError: err,
    });
  }
};
