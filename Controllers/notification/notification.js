const { Notification } = require("../../models");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getNotification = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.json({
        status: false,
        message: "Notification id must be required.",
        data: {},
      });
    }
    var createdAt = moment().subtract(30, "days");
    await Notification.destroy({
      where: { createdAt: { [Op.lte]: createdAt } },
    });

    const data = await Notification.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ status: true, message: "Notification list.", data });
  } catch (err) {
    res.json({
      status: false,
      message: "Something went wronge.",
      data: {},
      orignalError: err,
    });
  }
};
