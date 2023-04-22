module.exports = (sequelize, Sequelize) => {

    const userChat = sequelize.define("user_chat", {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignkey: true
        },
        buddy_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignkey: true
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW

        },
    },
        {
            createdAt: false,
            updatedAt: false,
        }
    );

    return userChat;
};