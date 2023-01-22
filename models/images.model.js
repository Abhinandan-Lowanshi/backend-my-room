module.exports = (sequelize, Sequelize) => {

    const image = sequelize.define("images", {
        img_pkey: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        img_rm_fkey: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            references: {
                model: 'room_details',
                key: 'rm_pkey',
            },
        },
        img_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        img_dscptin: {
            type: Sequelize.STRING(256),
            allowNull: false,
        },
    },
        {
           
            updatedAt: false,
        }
    );

    return image;
};