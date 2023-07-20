// const asyncLoop = require('node-async-loop');
const { room_details, images, favorite, Users } = require("../../models");
const config = require('../../config');
const base64 = require('base-64')
// const Sequelize = require("sequelize");
// const Op = Sequelize.Op;

exports.UserAccountDetails = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id || user_id === undefined || user_id === null) {
            return res.json({ status: false, message: 'User id is empty not allowed.' })
        }

        const emailExists = await Users.findOne({ where: { usr_pkey: user_id } });

        if (!emailExists) {
            return res.json({
                status: true,
                message: 'User details not found.',
                data: {}
            })
        }

        return res.json({
            status: true,
            message: 'User details get successfully get.',
            data: {
                "usr_pkey": emailExists.usr_pkey,
                "usr_firstName": emailExists.usr_firstName,
                "usr_lastName": emailExists.usr_lastName,
                "usr_email": emailExists.usr_email,
                "usr_phone": emailExists.usr_phone,
                "usr_parmentAdrss": emailExists.usr_parmentAdrss,
                "usr_currentAdrss": emailExists.usr_currentAdrss,
                "createdAt": emailExists.createdAt
            }
        })


    } catch (err) { res.json({ status: false, message: 'Something went wrong.', oringalError: err }) }
}

exports.UserResatPassword = async (req, res) => {
    try {

        const { user_id, old_password, new_password } = req.body;

        let err;
        let obj = {}

        if (!old_password || old_password === "" || !new_password || new_password === "" || !user_id || user_id == "") {
            err = 'all field must be required.'
        }
        else if (new_password.length <= 7) {
            err = 'Password should be of minimum 8 characters.'
        }
        else if (new_password.length >= 21) {
            err = `Password should have a maximum length of 20 characters.`
        }

        if (err) {
            return res.json({
                status: false,
                message: err
            })
        }

        const userData = await Users.findOne({ where: { usr_pkey: user_id } });

        if (!userData) {
            err = "User not exist."
        } else if (old_password !== base64.decode(userData.usr_pasword)) {
            err = 'Old password is wrong.'
        }

        if (err) {
            return res.json({
                status: false,
                message: err
            })
        }

        const encoded = await base64.encode(new_password);

        await Users.update({ usr_pasword: encoded }, { where: { usr_pkey: user_id } })
            .then((result) => {
                res.json({
                    status: true,
                    message: "Password successfully reset."
                })
            }).catch((err) => {
                res.json({ status: false, code: 500, message: "Something went wronge.", err: err });
            });
    }
    catch (err) { res.json({ status: false, message: 'Something went wrong.', orignalError: err }) }
}

exports.EditProfile = async (req, res) => {
    try {

        const { user_id, usr_firstName, usr_lastName, usr_phone, usr_parmentAdrss, usr_currentAdrss } = req.body;

        let err;
        let obj = {}

        if (!user_id || user_id === undefined || user_id === null) {
            return res.json({ status: false, message: 'User id must be required.' })
        }

        if (usr_firstName) {
            obj.usr_firstName = usr_firstName;
        }
        if (usr_lastName) {
            obj.usr_lastName = usr_lastName;
        }
        if (usr_phone) {
            obj.usr_phone = usr_phone;
        }
        if (usr_parmentAdrss) {
            obj.usr_parmentAdrss = usr_parmentAdrss;
        }
        if (usr_currentAdrss) {
            obj.usr_currentAdrss = usr_currentAdrss;
        }

        if (Object.keys(obj).length === 0) {
            return res.json({
                status: false,
                message: 'Not get any key for update.'
            })
        }

        await Users.update(obj, { where: { usr_pkey: user_id } })
            .then((result) => {
                res.json({
                    status: true,
                    message: "User details successfully Edited.",
                    data: result
                })
            }).catch((err) => {
                res.json({ status: false, message: "Something went wronge.", orignalError: err });
            });

    } catch (err) { res.json({ status: false, message: "Something went wronge.", orignalError: err }); }

}

exports.updateUserNotfication = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) { return res.json({ status: false, message: 'User id must be requried.' }) }
        const data = await Users.update(req.body, { where: { usr_pkey: user_id } })
        res.json({ status: true, message: 'User details successfully.', data })
    } catch (err) {
        res.json({ status: false, message: 'Something went wrong.', orignalError: err })
    }
}

exports.getUserNotification = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) { return res.json({ status: false, message: 'User id must be requried.' }) }
        const data = await Users.findOne({ where: { usr_pkey: user_id } })
        res.json({ status: true, message: 'User details get successfully.', data })
    } catch (err) {
        res.json({ status: false, message: 'Something went wrong.', orignalError: err })
    }
}


