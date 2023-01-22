module.exports = (sequelize, Sequelize) => {

    const temp = sequelize.define("temp", {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        emailOTP: {
            type: Sequelize.INTEGER(6),
            allowNull: false
        }
    },
        {

            updatedAt: false,
        }
    );

    return temp;
};