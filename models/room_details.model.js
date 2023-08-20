module.exports = (sequelize, Sequelize) => {
  const room_details = sequelize.define(
    "room_details",
    {
      rm_pkey: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      rm_usr_fkey: {
        type: Sequelize.INTEGER(11),
        foreignkey: true,
        allowNull: false,
        references: {
          model: "users",
          key: "usr_pkey",
        },
      },
      rm_status: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 1,
      },
      rm_own_fullname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_own_mble_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_size: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      deposit: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      monthly_maintain: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_furnisd_status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_availble: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_prking_avblity: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_depndecy: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_flor: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_rent: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_house_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_colny: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_state: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      rm_latitude: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
      },
      rm_longitude: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
      },
      rm_description: {
        type: Sequelize.STRING(256),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      underscored: true,
    }
  );

  return room_details;
};
