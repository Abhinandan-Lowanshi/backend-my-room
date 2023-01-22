module.exports = (sequelize, Sequelize) => {

    const notification = sequelize.define("notification", {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            references: {
                model: 'users',
                key: 'usr_pkey',
            },
        },
        title: {
            type: Sequelize.STRING(),
            allowNull: false,
        },
        payload: {
            type: Sequelize.STRING,
            get: function () {
                if (this.getDataValue('payload')) {
                    return JSON.parse(this.getDataValue('payload'));
                }
                return {};
            },
            set: function (val) {
                if (val) {
                    return this.setDataValue('payload', JSON.stringify(val));
                }
                return this.setDataValue('payload', JSON.stringify({}));
            }
        },
    },
        {

            updatedAt: false,
        }
    );

    return notification;
};