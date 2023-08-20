const db = require("../../models");
const upload = require("../../services/multer");
const asyncLoop = require("node-async-loop");
const {
  room_details,
  images,
  favorite,
  Users,
  Notification,
  rating,
} = require("../../models");
const config = require("../../config");
const fs = require("fs");
const path = require("path");
const notification = require("../../public/notification");
const { response } = require("express");
const { count } = require("console");
const { getRatting } = require("./commonFuction/CommonFuctions");

let uploadImg = upload.array("Images", 10);

exports.addRoom = async (req, res, next) => {
  try {
    let imgData = [];

    uploadImg(req, res, async function (err) {
      if (err) {
        return res.json({
          status: false,
          message: err,
        });
      }

      if (!req.files) {
        throw "Please upload file.";
      }
      const {
        rm_usr_fkey,
        rm_own_Fullname,
        rm_own_mble_num,
        rm_size,
        rm_furnisd_status,
        rm_availble,
        rm_prking_avblity,
        rm_depndecy,
        rm_flor,
        rm_rent,
        rm_house_no,
        rm_colny,
        rm_city,
        rm_state,
        rm_latitude,
        rm_longitude,
        rm_description,
        deposit,
        monthly_maintain,
      } = req.body;

      const files = req.files;
      const reqData = {
        rm_usr_fkey,
        rm_own_fullname: rm_own_Fullname,
        rm_own_mble_num,
        rm_size,
        rm_furnisd_status,
        rm_availble,
        rm_prking_avblity,
        rm_depndecy,
        rm_flor,
        rm_rent,
        rm_house_no,
        rm_colny,
        rm_city,
        rm_state,
        rm_latitude,
        rm_longitude,
        rm_description,
        deposit,
        monthly_maintain,
      };

      await room_details
        .create(reqData)
        .then(async (result) => {
          await files.forEach(async (element) => {
            let object = {
              img_rm_fkey: result.dataValues.rm_pkey,
              img_name: element.filename,
              img_dscptin: element.originalname,
            };
            console.log(object, "object");
            await imgData.push(object);
          });

          await images.bulkCreate(imgData).then(async (resullt) => {
            await getNearUser(result.dataValues);

            res.json({
              status: true,
              message: "details successfully inserted.",
            });
          });
        })
        .catch((err) => {
          res.json({
            status: false,
            message: "Something went wronge.",
            data: {},
            orignalError: err,
          });
        });
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wronge.",
      data: {},
      orignalError: err,
    });
  }
};

exports.FindRoom = async (req, res) => {
  try {
    const { user_id, latitude, longitude, radius } = req.body;
    if (
      !user_id ||
      user_id == "" ||
      !latitude ||
      latitude === "" ||
      !longitude ||
      longitude === ""
    ) {
      return res.json({
        status: false,
        message: "Location is undefind or empty.",
        data: {},
      });
    }

    await Users.update(
      { usr_latitude: latitude, usr_longitude: longitude },
      { where: { usr_pkey: user_id } }
    );

    let sql = `select 
        room_details.rm_pkey,
        room_details.created_at,
        room_details.rm_usr_fkey,
        room_details.rm_own_fullname,
        room_details.rm_status,
        room_details.rm_own_mble_num,
        room_details.rm_size,
        room_details.rm_furnisd_status,
        room_details.rm_availble,
        room_details.rm_prking_avblity,
        room_details.rm_depndecy,
        room_details.rm_flor,
        room_details.rm_rent,
        room_details.rm_house_no,
        room_details.rm_colny,
        room_details.rm_city,
        room_details.rm_state,
        room_details.rm_latitude,
        room_details.rm_longitude,
        room_details.rm_description,
        room_details.deposit,
        room_details.monthly_maintain,
        favorites.fav_usr_fkey as favorite_key,
        (6371 * acos( cos( radians( ${latitude} ) )
        * cos( radians( room_details.rm_latitude ) ) * cos( radians( room_details.rm_longitude ) - radians( ${longitude} ) ) + sin( radians(${latitude}) ) * sin( radians( room_details.rm_latitude ) ) ) ) 
        AS room_distance
        from room_details
        LEFT JOIN favorites ON room_details.rm_pkey = favorites.fav_rm_fkey
        where rm_usr_fkey != ${user_id} and room_details.rm_status = 1 having room_distance <= ${radius};`;

    await db.sequelize
      .query(sql)
      .then(async (result) => {
        if (result[0].length === 0) {
          return res.json({
            status: true,
            message: "Room list not found.",
            data: [],
          });
        }

        // res.json(result[0])
        await getImage(result[0], user_id, res);
      })
      .catch((err) =>
        res.json({ status: false, message: "Something went wrong.", data: {} })
      );
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      data: {},
    });
  }
};

exports.EditRoom = async (req, res) => {
  try {
    const { room_id, data } = req.body;
    console.log(data);
    if (Object.keys(data).length == 0 || !room_id) {
      return res.json({
        status: false,
        message: "Empty data is not allowed.",
      });
    }
    await room_details
      .update(data, { where: { rm_pkey: room_id } })
      .then((result) => {
        res.json({
          status: true,
          code: 200,
          message: "Room details successfully updated.",
          data: result,
        });
      })
      .catch((err) => {
        console.log(">>>!!!!", err);
        res.json({
          status: false,
          code: 500,
          message: "Something went wronge.",
          err: err,
        });
      });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      oringalError: err,
    });
  }
};

exports.ViewRoom = async (req, res) => {
  try {
    const { user_id, room_id } = req.body;

    if (
      !room_id ||
      room_id === undefined ||
      room_id === null ||
      !user_id ||
      user_id === null
    ) {
      return res.json({
        status: false,
        message: "room id or user_id empty not allowed.",
      });
    }

    const val = await room_details.findOne({
      include: [
        {
          model: favorite,
          as: "favorites",
          required: false,
          where: { fav_usr_fkey: user_id },
        },
      ],
      where: { rm_pkey: room_id },
    });

    if (!val) {
      return res.json({
        status: true,
        message: "Room details not found.",
        data: {},
      });
    }

    const data = await images.findAll({
      where: { img_rm_fkey: room_id },
      attributes: [
        "img_pkey",
        "img_rm_fkey",
        [`concat('${config.HOST_NAME}',  img_name)`, "img_name"],
        "img_dscptin",
      ],
    });

    return res.json({
      status: true,
      message: "Room details get successfully.",
      data: {
        rm_pkey: val.rm_pkey,
        rm_usr_fkey: val.rm_usr_fkey,
        rm_own_Fullname: val.rm_own_fullname,
        rm_own_mble_num: val.rm_own_mble_num,
        rm_size: val.rm_size,
        rm_furnisd_status: val.rm_furnisd_status,
        rm_availble: val.rm_availble,
        rm_prking_avblity: val.rm_prking_avblity,
        rm_depndecy: val.rm_depndecy,
        rm_flor: val.rm_flor,
        rm_rent: val.rm_rent,
        rm_house_no: val.rm_house_no.toString(),
        rm_colny: val.rm_colny,
        rm_city: val.rm_city,
        rm_state: val.rm_state,
        rm_latitude: val.rm_latitude.toString(),
        rm_longitude: val.rm_longitude.toString(),
        rm_description: val.rm_description,
        deposit: val.deposit,
        monthly_maintain: val.monthly_maintain,
        rm_status: val?.rm_status == 1 ? true : false,
        favorite_key: val.favorites.length === 0 ? false : true,
        images: data,
      },
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      oringalError: err,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { room_id } = req.body;

    await favorite.destroy({ where: { fav_rm_fkey: room_id } });
    const imageData = await images.findAll({
      where: { img_rm_fkey: room_id },
      attributes: ["img_name"],
    });
    // console.log("imageData.length", imageData.length);
    if (imageData.length === 0) {
      return res.json({
        status: false,
        message: "Room details not found.",
      });
    }

    asyncLoop(
      imageData,
      async (val, next) => {
        fs.unlinkSync("./uploads/" + val?.dataValues?.img_name + "");
        next();
      },
      async () => {
        await images.destroy({ where: { img_rm_fkey: room_id } });
        const roomData = await room_details.destroy({
          where: { rm_pkey: room_id },
        });
        res.json({
          status: true,
          message: "Room successfully deleted.",
          data: roomData,
        });
      }
    );
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      orignalError: err,
    });
  }
};
exports.MyRoomList = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id || user_id === "" || user_id === undefined) {
      return res.json({
        status: false,
        message: "All feild must be required.",
      });
    }
    await room_details
      .findAll({
        include: ["favorites"],
        where: { rm_usr_fkey: user_id },
        order: [["createdAt", "DESC"]],
      })
      .then((result) => {
        if (result === null || result.length === 0) {
          return res.json({
            status: true,
            message: "Room list is empty.",
            data: [],
          });
        }
        mYRoomListImage(result, res, user_id);
      });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      orignalError: err,
    });
  }
};

exports.updateRoomStatus = async (req, res) => {
  try {
    const { room_id, status_type } = req.body;

    if (
      !room_id ||
      room_id == "" ||
      room_id === undefined ||
      status_type === undefined
    ) {
      return res.json({
        status: false,
        message: "All feild must be required.",
      });
    }

    await room_details
      .update(
        {
          rm_status: status_type,
        },
        { where: { rm_pkey: room_id } }
      )
      .then((result) => {
        res.json({
          status: true,
          code: 200,
          message: "Room status successfully updated.",
        });
      })
      .catch((err) => {
        console.log(">>>!!!!", err);
        res.json({
          status: false,
          code: 500,
          message: "Something went wronge.",
          err: err,
        });
      });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      orignalError: err,
    });
  }
};

exports.getLatest = async (req, res) => {
  try {
    let { userId } = req.body;
    let data = await Users.findAll();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

const getImage = (data, user_id, res) => {
  const roomList = [];

  asyncLoop(
    data,
    async (val, next) => {
      const data = await images.findAll({
        where: { img_rm_fkey: val.rm_pkey },
        attributes: [
          "img_pkey",
          "img_rm_fkey",
          [`concat('${config.HOST_NAME}',  img_name)`, "img_name"],
          "img_dscptin",
        ],
      });
      let reviews = {};
      reviews = await getRatting(val?.rm_pkey, user_id);
      let object = {
        rm_pkey: val.rm_pkey,
        created_at: val.created_at,
        rm_usr_fkey: val.rm_usr_fkey,
        rm_own_Fullname: val.rm_own_fullname,
        rm_own_mble_num: val.rm_own_mble_num,
        rm_size: val.rm_size,
        rm_furnisd_status: val.rm_furnisd_status,
        rm_availble: val.rm_availble,
        rm_prking_avblity: val.rm_prking_avblity,
        rm_depndecy: val.rm_depndecy,
        rm_flor: val.rm_flor,
        rm_rent: val.rm_rent,
        rm_house_no: val.rm_house_no,
        rm_colny: val.rm_colny,
        rm_city: val.rm_city,
        rm_state: val.rm_state,
        rm_latitude: val.rm_latitude,
        rm_longitude: val.rm_longitude,
        rm_description: val.rm_description,
        deposit: val.deposit,
        monthly_maintain: val.monthly_maintain,
        favorite_key: val?.favorite_key == user_id ? true : false,
        rm_status: val?.rm_status == 1 ? true : false,
        room_distance: val?.room_distance ? val?.room_distance.toString() : "",
        images: data,
        reviews,
      };

      roomList.push(object);
      next();
    },
    () => {
      res.json({
        status: true,
        code: 200,
        message: "Room list successfully get.",
        data: roomList,
      });
    }
  );
};

const mYRoomListImage = (data, res, user_id) => {
  const roomList = [];

  asyncLoop(
    data,
    async (val, next) => {
      // console.log(val);
      const data = await images.findAll({
        where: { img_rm_fkey: val.rm_pkey },
        attributes: [
          "img_pkey",
          "img_rm_fkey",
          [`concat('${config.HOST_NAME}',  img_name)`, "img_name"],
          "img_dscptin",
        ],
      });
      let reviews = {};
      reviews = await getRatting(val?.rm_pkey, user_id);
      let object = {
        rm_pkey: val.rm_pkey,
        created_at: val.createdAt,
        rm_usr_fkey: val.rm_usr_fkey,
        rm_own_Fullname: val.rm_own_fullname,
        rm_own_mble_num: val.rm_own_mble_num,
        rm_size: val.rm_size,
        rm_furnisd_status: val.rm_furnisd_status,
        rm_availble: val.rm_availble,
        rm_prking_avblity: val.rm_prking_avblity,
        rm_depndecy: val.rm_depndecy,
        rm_flor: val.rm_flor,
        rm_rent: val.rm_rent,
        rm_house_no: val.rm_house_no,
        rm_colny: val.rm_colny,
        rm_city: val.rm_city,
        rm_state: val.rm_state,
        rm_latitude: val.rm_latitude,
        rm_longitude: val.rm_longitude,
        rm_description: val.rm_description,
        deposit: val.deposit,
        monthly_maintain: val.monthly_maintain,
        favorite_key: val?.favorites.length == 0 ? false : true,
        rm_status: val?.rm_status == 1 ? true : false,
        room_distance: val?.room_distance ? val?.room_distance.toString() : "",
        images: data,
        reviews,
      };

      roomList.push(object);
      next();
    },
    () => {
      res.json({
        status: true,
        code: 200,
        message: "Room list successfully get.",
        data: roomList,
      });
    }
  );
};

const getNearUser = async (roomDetails) => {
  let sql = `select 
    users.usr_pkey,
    users.device_token,
    (6371 * acos( cos( radians( ${roomDetails.rm_latitude} ) )
    * cos( radians( users.usr_latitude ) ) * cos( radians( users.usr_longitude ) - radians( ${
      roomDetails.rm_longitude
    } ) ) + sin( radians(${
    roomDetails.rm_latitude
  }) ) * sin( radians( users.usr_latitude ) ) ) ) 
    AS user_distance
    from users
    where users.is_notify = 1 and usr_pkey != ${
      roomDetails.rm_usr_fkey
    } having user_distance <= ${10};`;

  let uploadNotification = [];

  const payload = {
    title: `${roomDetails.rm_size} has uploaded at ${roomDetails.rm_colny} .`,
    rm_pkey: roomDetails.rm_pkey,
    rm_size: roomDetails.rm_size,
    rm_furnisd_status: roomDetails.rm_furnisd_status,
    rm_usr_fkey: roomDetails.rm_usr_fkey,
  };
  db.sequelize
    .query(sql)
    .then(async (result) => {
      let androidTokens = [];
      if (result[0].length > 0) {
        result[0].forEach(async (data) => {
          let obj = {
            userId: data.usr_pkey,
            title: payload.title,
            payload: payload,
          };
          await uploadNotification.push(obj);
          await androidTokens.push(data.device_token);
        });
        await notification.sendAndroidNotification(androidTokens, payload);
      }
      await Notification.bulkCreate(uploadNotification);
    })
    .catch((err) => {
      console.log("err", err);
    });
};

exports.addReview = async (req, res) => {
  try {
    const { room_id, user_id, review, ratingCount = 0, user_name } = req.body;
    let sql = `select * from ratings where rm_usr_fkey = ${user_id} and room_id =${room_id}`;

    if (!room_id) {
      res.json({
        status: false,
        message: "Room id can't be empty",
        data: {},
      });
      return;
    }
    if (!user_id) {
      res.json({
        status: false,
        message: "User id can't be empty",
        data: {},
      });
      return;
    }
    if (!review) {
      res.json({
        status: false,
        message: "Review can't be empty",
        data: {},
      });
      return;
    }
    // if (!ratingCount) {
    //   res.json({
    //     status: false,
    //     message: "Rating can't be empty",
    //     data: {},
    //   });
    //   return;
    // }
    if (!user_name) {
      res.json({
        status: false,
        message: "Username can't be empty",
        data: {},
      });
      return;
    }
    await db.sequelize
      .query(sql)
      .then(async (result) => {
        if (result[0]?.length > 0) {
          return res.json({
            status: false,
            message: "You cant rate twice",
          });
        } else {
          const reqData = {
            room_id,
            rm_usr_fkey: user_id,
            review,
            ratings: ratingCount,
            user_name,
          };
          await rating
            .create(reqData)
            .then(async (result) => {
              res.json({
                status: true,
                message: "Review add successfully",
                data: result,
              });
            })
            .catch((err) => {
              res.json({
                status: false,
                message: "Something went wrong.",
                data: {},
                orignalError: err,
              });
            });
        }
      })
      .catch((err) =>
        res.json({
          status: false,
          message: "Something went wrong.",
          data: {},
        })
      );
  } catch (err) {
    console.log("err", err);
    res.json({
      status: false,
      message: "Something went wrong.",
      data: err,
    });
  }
};
