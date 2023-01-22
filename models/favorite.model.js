module.exports = (sequelize, Sequelize) => {

    const favorite = sequelize.define("favorites", {
        fav_pkey: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        fav_usr_fkey: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            references: {
                model: 'users',
                key: 'usr_pkey',
            },
        },
        fav_rm_fkey: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            onDelete: 'cascade',
            references: {
                model: 'room_details',
                key: 'rm_pkey',
            },
        },
    },
        {
            updatedAt: false,
            underscored: true
        }

    );

    return favorite;
};