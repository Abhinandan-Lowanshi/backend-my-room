const db = require("../../models");
const asyncLoop = require("node-async-loop");
const config = require("../../config");
const moment = require("moment");
const Msg = db.messages;
const Walker = db.users;

exports.chatUserList = async (req, res) => {
  try {
    const { user_id } = req.body;
    let sql1 = `SELECT chat_buddies.buddy_id as user_id,
         users.usr_first_name,
         users.usr_last_name, 
         chat_buddies.created_date
         FROM chat_buddies
        LEFT JOIN users ON chat_buddies.buddy_id = users.usr_pkey
        WHERE chat_buddies.user_id = ${user_id}  ORDER BY chat_buddies.created_date DESC;`;

    let sql2 = `SELECT chat_buddies.user_id,
         users.usr_first_name,
         users.usr_last_name, 
         chat_buddies.created_date
         FROM chat_buddies
        LEFT JOIN users ON chat_buddies.user_id = users.usr_pkey
        WHERE chat_buddies.buddy_id = ${user_id}  ORDER BY chat_buddies.created_date DESC;`;

    db.sequelize.query(sql1).then(async (data1) => {
      db.sequelize.query(sql2).then(async (data2) => {
        if (data1[0].length === 0 && data2[0].length === 0) {
          return res.json({
            status: true,
            code: 200,
            message: "Buddies list not found.",
            data: [],
          });
        }

        let data = await mergeTwoDesc(data1[0], data2[0]);
        res.json({
          status: true,
          code: 200,
          message: "Successfully get chat list.",
          data,
        });
      });
    });
  } catch (err) {
    res.json({
      status: false,
      code: 500,
      message: "Something went wrong.",
      err: err,
    });
  }
};

exports.chatList = async (req, res) => {
  try {
    const { user_id, buddy_id, page } = req.body;
    const { offset, limit } = await getOffsetAndLimit(page);

    let sql1 = `SELECT 
        buddy_id as user_id,
         message,
         created_date,
         ('sent') as message_type
         FROM user_chats 
         WHERE user_id = ${user_id} AND buddy_id = ${buddy_id} ORDER BY created_date DESC LIMIT ${limit} OFFSET ${offset};`;

    let sql2 = `SELECT
         user_id,
         message,
         created_date,
         ('received') as message_type
         FROM user_chats
         WHERE user_id = ${buddy_id} AND buddy_id = ${user_id} ORDER BY created_date DESC LIMIT ${limit} OFFSET ${offset};`;

    db.sequelize
      .query(sql1)
      .then(async (data1) => {
        db.sequelize
          .query(sql2)
          .then(async (data2) => {
            let data = await mergeTwoDesc(data1[0], data2[0]);
            // console.log
            // let chatArr = []
            // data.forEach((item, i) => {
            //     chatArr.push({ id: i, ...item })
            // })
            if (data1[0].length === 0 && data2[0].length === 0) {
              res.json({
                status: true,
                code: 200,
                message: "Chat list not found.",
                data: [],
              });
            } else {
              res.json({
                status: true,
                code: 200,
                message: "Successfully get chat list.",
                data,
              });
            }
          })
          .catch((err) => {
            return res.json({
              status: false,
              code: 404,
              message: "Something went wrong.",
            });
          })
          .catch((err) => {
            return res.json({
              status: false,
              code: 404,
              message: "Something went wrong.",
            });
          });
      })
      .catch((err) => {
        return res.json({
          status: false,
          code: 404,
          message: "Something went wrong.",
        });
      });
  } catch (err) {
    res.json({
      status: false,
      code: 404,
      message: "Something went wrong.",
    });
  }
};

const mergeTwoDesc = async (arr1, arr2, type) => {
  let result = [...arr1, ...arr2];

  return result.sort((a, b) => {
    let fa = a.created_date,
      fb = b.created_date;
    //   condition = type ? fa < fb : fa > fb;
    if (fa > fb) {
      return -1;
    }
    if (fa < fb) {
      return 1;
    }
    return 0;
  });
};

function getOffsetAndLimit(page) {
  let offset = ((page == 0 ? 1 : page) - 1) * 20;
  let limit = 20;
  return { offset, limit };
}
