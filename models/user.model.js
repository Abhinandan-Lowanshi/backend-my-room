module.exports = (sequelize, Sequelize) => {

    const user = sequelize.define("users", {
        usr_pkey: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        usr_firstName: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        usr_lastName: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        usr_email: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        usr_phone: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        usr_parmentAdrss: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: "",
        },
        usr_currentAdrss: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: ""
        },
        usr_pasword: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        usr_otp: {
            type: Sequelize.INTEGER(6),
            allowNull: false,
            defaultValue: 0
        },
        usr_latitude: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0000
        },
        usr_longitude: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0000
        },
        isNotify: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: true
        },
        device_token: {
            type: Sequelize.STRING(256),
            allowNull: false,
            defaultValue: ""
        }
    }, {
        updatedAt: false,
        underscored: true
    }
    );

    return user;
};