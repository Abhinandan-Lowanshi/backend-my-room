const validator = require('validator');
const base64 = require("base-64");
const db = require("../../models");
const jwtHelper = require('../../helper/jwthelper')
const User = db.Users;


exports.login = async (req, res) => {
    try {

        const { email, password, device_token } = req.body;

        if (email === "" || email === undefined || email === null) {
            throw ("Required email address.");
        } else if (!validator.isEmail(email)) {
            throw ("Invalid email address.");
        } else if (!password || password === undefined || password === null) {
            throw ("Required password.")
        }

        const emailExists = await User.findOne({ where: { usr_email: email.toLowerCase() } });

        if (emailExists) {

            const userpassword = base64.decode(emailExists.dataValues.usr_pasword);

            if (userpassword === password) {
                if (device_token) {
                    await User.update({ device_token: device_token }, { where: { usr_email: email.toLowerCase() } })
                }
                const token = await jwtHelper.signAccessToken({ email: email, userId: emailExists.usr_pkey })
                res.json({
                    status: true,
                    message: "Login successfully.",
                    token,
                    data: {
                        "usr_id": emailExists.dataValues.usr_pkey,
                        "usr_firstName": emailExists.dataValues.usr_firstName,
                        "usr_lastName": emailExists.dataValues.usr_lastName,
                        "usr_email": emailExists.dataValues.usr_email,
                        "usr_phone": emailExists.dataValues.usr_phone,
                        "usr_parmentAdrss": emailExists.dataValues.usr_parmentAdrss,
                        "usr_currentAdrss": emailExists.dataValues.usr_currentAdrss
                    }
                })
            }
            else {
                res.json({ status: false, message: "Invalid Email address or password.", data: {} });
            }

        } else {
            res.json({
                status: false,
                code: 400,
                message: "Invalid Email address or password.",
                data: {}
            })
        }


    }
    catch (err) { console.log("err", err); res.json({ status: false, message: 'Something went wronge.', data: {}, orignalError: err }) }

}