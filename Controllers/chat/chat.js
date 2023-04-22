const db = require("../../models");
const Sequelize = require("sequelize");
const moment = require("moment");
const FCM = require("fcm-node");
const config = require("../../config");
const chatBuddies = db.chatBuddies;
const Walker = db.Walkers;
const userChat = db.userChat;
const Op = Sequelize.Op;

exports.AddUser = async (data) => {
  try {
    const { user_id, buddy_id } = data,
      current_date = new Date(),
      Exists = await chatBuddies.findOne({
        where: {
          user_id: {
            [Op.or]: [user_id, buddy_id],
          },
          buddy_id: {
            [Op.or]: [buddy_id, user_id],
          },
        },
      });

    if (Exists) {
      return Exists.chat_room_id;
    }

    let chat_room_id = Date.now() + Math.floor(Math.random() * 1000000000) + 1;

    const bud_data = {
      user_id,
      buddy_id,
      chat_room_id,
      created_date: current_date,
    };
    return await chatBuddies
      .create(bud_data)
      .then((rrsult) => {
        return rrsult.dataValues.cb_room_id;
      })
      .catch((err) => {
        console.log("err>>>>", err);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.getRoomId = async (data) => {
  try {
    const { user_id, buddy_id, message } = data;

    if (message === "") {
      return null;
    }
    let currentDate = new Date();
    // const status = await Walker.findOne({ where: { user_id: buddy_id }, attributes: ['wkr_online_status', 'wkr_device_token'] });
    // const walkerData = await Walker.findOne({ where: { user_id: user_id }, attributes: ['wkr_firstname', 'wkr_surname', 'wkr_tz'] });
    // if (status.wkr_online_status === 0) {
    //     let object = {
    //         message: `${walkerData.wkr_firstname} ${walkerData.wkr_surname} \n ${message}`,
    //         token: status.wkr_device_token
    //     }
    //     await pushNotification(object);
    // }
    const userExists = await chatBuddies.findOne({
      where: {
        user_id: {
          [Op.or]: [user_id, buddy_id],
        },
        buddy_id: {
          [Op.or]: [buddy_id, user_id],
        },
      },
    });
    const msgData = {
      user_id,
      buddy_id,
      message,
      created_date: currentDate,
    };
    await userChat.create(msgData).then(async (rrsullt) => {
      console.log("rrsullt", rrsullt.dataValues.message);
    });

    if (userExists) {
      return {
        roomId: userExists.chat_room_id,
        content: {
          user_id: user_id,
          message: message,
          created_date: currentDate,
          message_type: "received",
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
};
