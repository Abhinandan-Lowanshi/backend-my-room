const asyncLoop = require("node-async-loop");
const { images, favorite } = require("../../models");
const config = require("../../config");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.Tofavorite = async (req, res) => {
  try {
    const { user_id, room_id, fav_type } = req.body;

    if (
      !user_id ||
      user_id == "" ||
      user_id === undefined ||
      !room_id ||
      room_id == "" ||
      room_id === undefined ||
      fav_type === undefined
    ) {
      return res.json({
        status: false,
        message: "All field must be required.",
      });
    }
    if (fav_type == 1) {
      const existdata = await favorite.findOne({
        where: {
          [Op.and]: [
            {
              fav_usr_fkey: { [Op.like]: user_id },
            },
            {
              fav_rm_fkey: { [Op.like]: room_id },
            },
          ],
        },
      });

      if (existdata) {
        return res.json({
          status: false,
          message: "Room already added to favorite list.",
        });
      }

      await favorite
        .create({ fav_usr_fkey: user_id, fav_rm_fkey: room_id })
        .then((result) => {
          if (!result) {
            throw "Something went wrong.";
          }

          return res.json({
            status: true,
            message: "Room added to favorite list successfully.",
          });
        })
        .catch((err) => {
          res.json({
            status: false,
            message: "Something went wrong.",
            orignalError: err,
          });
        });
    } else {
      await favorite
        .destroy({
          where: {
            [Op.and]: [
              {
                fav_usr_fkey: { [Op.like]: user_id },
              },
              {
                fav_rm_fkey: { [Op.like]: room_id },
              },
            ],
          },
        })
        .then((result) => {
          if (result) {
            return res.json({
              status: true,
              message: "Room removed to favorite list successfully.",
            });
          }

          return res.json({
            status: true,
            message: "Room details not found in favorite list.",
          });
        })
        .catch((err) => {
          res.json({
            status: false,
            message: "Something went wrong.",
            orignalError: err,
          });
        });
    }
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      orignalError: err,
    });
  }
};

exports.FavroiteList = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id || user_id === "" || user_id === undefined) {
      return res.json({
        status: false,
        message: "All feild must be required.",
      });
    }

    await favorite
      .findAll({
        include: ["room_details"],
        where: { fav_usr_fkey: user_id },
        order: [["created_at", "DESC"]],
      })
      .then((result) => {
        if (result.length === 0 || result === null) {
          return res.json({
            status: true,
            message: "Favorite list is empty.",
            data: [],
          });
        }
        getImage(result, res);
      });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wrong.",
      orignalError: err,
    });
  }
};

const getImage = (data, res) => {
  const roomList = [];

  asyncLoop(
    data,
    async (val, next) => {
      const data = await images.findAll({
        where: { img_rm_fkey: val?.room_details?.rm_pkey },
        attributes: [
          "img_pkey",
          "img_rm_fkey",
          [`concat('${config.HOST_NAME}',  img_name)`, "img_name"],
          "img_dscptin",
        ],
      });

      let object = {
        rm_pkey: val?.room_details?.rm_pkey,
        created_at: val?.room_details?.createdAt,
        rm_usr_fkey: val?.room_details?.rm_usr_fkey,
        fav_usr_fkey: val.fav_usr_fkey,
        rm_own_Fullname: val?.room_details?.rm_own_fullname,
        rm_own_mble_num: val?.room_details?.rm_own_mble_num.toString(),
        rm_size: val?.room_details?.rm_size,
        rm_furnisd_status: val?.room_details?.rm_furnisd_status,
        rm_availble: val?.room_details?.rm_availble,
        rm_prking_avblity: val?.room_details?.rm_prking_avblity,
        rm_depndecy: val?.room_details?.rm_depndecy,
        rm_flor: (val?.room_details?.rm_flor).toString(),
        rm_rent: val?.room_details?.rm_rent.toString(),
        rm_house_no: val?.room_details?.rm_house_no.toString(),
        rm_colny: val?.room_details?.rm_colny,
        rm_city: val?.room_details?.rm_city,
        rm_state: val?.room_details?.rm_state,
        rm_description: val?.room_details?.rm_description,
        rm_latitude: val?.room_details?.rm_latitude.toString(),
        rm_longitude: val?.room_details?.rm_longitude.toString(),
        favorite_key: true,
        rm_status: val?.room_details?.rm_status == 1 ? true : false,
        room_distance: val?.room_details?.room_distance,
        images: data,
      };

      roomList.push(object);
      next();
    },
    () => {
      res.json({
        status: true,
        code: 200,
        message: "Favorite list successfully get.",
        data: roomList,
      });
    }
  );
};
