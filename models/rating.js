module.exports = (sequelize, Sequelize) => {
  const ratings = sequelize.define(
    "ratings",
    {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      room_id: {
        type: Sequelize.INTEGER(11),
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
      ratings: {
        type: Sequelize.FLOAT(11),
        allowNull: false,
        defaultValue: 1.0,
      },
      review: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  return ratings;
};
