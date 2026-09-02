module.exports = (sequelize, Sequelize) => {

    const chatBuddies = sequelize.define("chat_buddies", {
        id: {
            type: Sequelize.INTEGER,
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
        chat_room_id: {
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

    return chatBuddies;
};